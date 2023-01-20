# Dashboard commands

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.\
The page will reload if you make edits. 

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `serve -s build`

This commands runs the build webapplication on a localhost.\
Open [http://localhost:4000](http://localhost:4000) to view it in the browser.

The files are from the build folder which are also assigned as static files for socketio.

### `npm run serve`

This command runs the application with gunicorn. \
It starts the socketio python server and the react client.\
Open [http://localhost:8000](http://localhost:8000) to view it in the browser.
