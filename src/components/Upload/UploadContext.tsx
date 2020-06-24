import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import * as actions from './Reducer/uploadActions';
import { initialState } from './Reducer/uploadInitialState';
import { uploadReducer } from './Reducer/uploadReducer';
import * as Types from './Reducer/uploadTypings';
import { useRequestFileUploadMutation } from './Upload.generated';
import { UploadManager } from './UploadManager';

interface FileInput {
  file: File;
  uploadId: string;
  fileName: string;
  callback: Types.UploadCallback;
}

interface UploadContextValue {
  addFileToUploadQueue: (input: FileInput) => void;
}

export const UploadContext = createContext<UploadContextValue | undefined>(
  undefined
);
UploadContext.displayName = 'UploadContext';

export const UploadProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(uploadReducer, initialState);
  const { submittedFiles } = state;
  const [requestFileUpload] = useRequestFileUploadMutation();

  const addFileToUploadQueue = useCallback(({ file, fileName, callback }) => {
    const newFile = {
      ...(callback ? { callback } : null),
      file,
      fileName,
      percentCompleted: 0,
      uploading: false,
    };
    dispatch({
      type: actions.FILE_SUBMITTED,
      file: newFile,
    });
  }, []);

  const setUploadingStatus = useCallback(
    (
      queueId: Types.UploadFile['queueId'],
      uploading: Types.UploadFile['uploading']
    ) => dispatch({ type: actions.UPLOAD_STATUS_UPDATED, queueId, uploading }),
    []
  );

  const handleFileUploadSuccess = useCallback(
    (response, queueId) => {
      console.info(`UPLOAD RESPONSE -> ${JSON.stringify(response)}`);

      const uploadedFile = submittedFiles.find(
        (file) => file.queueId === queueId
      );
      if (uploadedFile?.callback && uploadedFile?.uploadId) {
        const { callback, queueId, fileName, uploadId } = uploadedFile;
        callback(uploadId, fileName).then(() =>
          dispatch({
            type: actions.FILE_UPLOAD_COMPLETED,
            queueId,
            completedAt: new Date(),
          })
        );
      }
    },
    [submittedFiles]
  );

  const handleFileUploadError = useCallback((statusText, queueId) => {
    console.error(`UPLOAD ERROR -> ${JSON.stringify(statusText)}`);
    dispatch({
      type: actions.FILE_UPLOAD_ERROR_OCCURRED,
      queueId,
      error: new Error(statusText),
    });
  }, []);

  const handleFileProgress = useCallback(
    (queueId: Types.UploadFile['queueId'], event: ProgressEvent) => {
      const { loaded, total } = event;
      const percentCompleted = Math.floor((loaded / total) * 1000) / 10;
      console.log(`Percentage completed: ${percentCompleted}%`);
      dispatch({
        type: actions.PERCENT_COMPLETED_UPDATED,
        queueId,
        percentCompleted,
      });
    },
    []
  );

  const uploadFile = useCallback(
    (file: Types.UploadFile, url: string) => {
      const { queueId } = file;
      const payload = new FormData();
      payload.append('file', file.file);
      const xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          const { status } = xhr;
          const success = status === 0 || (status >= 200 && status < 400);
          if (success) {
            const { responseType } = xhr;
            const response =
              !responseType || responseType === 'text'
                ? xhr.responseText
                : responseType === 'document'
                ? xhr.responseXML
                : xhr.response;
            handleFileUploadSuccess(response, queueId);
          } else {
            handleFileUploadError(xhr.statusText, queueId);
          }
        }
      };

      xhr.upload.onprogress = handleFileProgress.bind(null, queueId);
      xhr.open('PUT', url);
      xhr.send(payload);
      setUploadingStatus(queueId, true);
    },
    [
      handleFileUploadSuccess,
      handleFileUploadError,
      setUploadingStatus,
      handleFileProgress,
    ]
  );

  const handleFileAdded = useCallback(
    async (file: Types.UploadFile) => {
      const { data } = await requestFileUpload();
      const { id, url } = data?.requestFileUpload ?? { id: '', url: '' };
      if (id && url) {
        dispatch({
          type: actions.FILE_UPLOAD_REQUEST_SUCCEEDED,
          queueId: file.queueId,
          uploadId: id,
        });
        uploadFile(file, url);
      }
    },
    [requestFileUpload, uploadFile]
  );

  // Very simple for now. We immediately submit all files to be uploaded
  useEffect(() => {
    const filesNotStarted = submittedFiles.filter(
      (file) => !file.uploading && !file.completedAt
    );
    for (const file of filesNotStarted) {
      handleFileAdded(file);
    }
  }, [submittedFiles, handleFileAdded]);

  return (
    <UploadContext.Provider value={{ addFileToUploadQueue }}>
      {children}
      <UploadManager state={state} />
    </UploadContext.Provider>
  );
};

export const useUpload = () => useContext(UploadContext);
