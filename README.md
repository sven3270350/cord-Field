# CORD Field

## Developer Setup

- `yarn`
- symlink the graphql schema file from the server.  
  This allows your editor to be smart with the graphql queries and provides it for the typescript generation.  
  (The server will automatically generate this file on run.)  
  Example:

  ```shell
  ln -s ../cord-api-v3/schema.graphql
  ```

To run the web server (for development) run: `yarn start`

To view storybook run: `yarn storybook`