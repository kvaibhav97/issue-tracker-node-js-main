# Issue Tracker

## How to Run the App

Application was build on Node.js v14.15.4 runtime.

Download this repo and run `npm i` to install node packages.

| Action                         | Command     |
| ------------------------------ | ----------- |
| Run application (on port 3000) | `npm start` |
| Run unit tests                 | `npm test`  |

Open app at http://localhost:3000/.

## Assignment Description

### Business Requirements Description

Create a simple issue tracker - both backend and frontend side. An issue should have a title, description and one of three states: open, pending and closed. Once an issue is pending it cannot be set back to open, similarly if an issue is closed it cannot be set back to pending or open. The minimal requirement is to provide a list view where you can see the issues and change their state.

Additional requirements:

- Use JavaScript.
- Use any library or framework as long as it's reasonable, but do not overcomplicate things.
- The code should be testable.
- Keep the code clean and understandable, document it if needed.
- Do not sacrifice code quality for the sake of completeness of the task.

### Tech Stack

Runtime: **Node.js v14.15.4**

Dependencies:

```
"ejs": "^3.1.6",
"express": "^4.17.1"
```

Dev dependencies:

```
"jasmine": "^3.7.0",
"nodemon": "^2.0.7"
```

The assignment can be accomplished entirely using Node.js with help of [Express.js](https://expressjs.com/) as a minimalist web framework for both backend and frontend implementation. Since the minimal requirement is to deliver the issues list view with simple inteaction to change the issue status, there is not a big need to install additional front-end framework. Markup for that case would be simple, so it can be achieved with HTML powered by templating library such as [EJS](https://ejs.co/). Using Node.js with Express.js for frontend would also mean that this web app is server-side rendered, which has some benefits for business critical apps such as improved performance with faster load times and improved SEO.

The main goal of this assignment was to provide user posibility to change the status of the chosen issue. In means of HTTP methods used:

- GET to retrieve issues and render the list in the client,
- PATCH to apply partial modifications to a resource, specifically `status` property of `issues` resource.

PATCH request was called from the client using [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

Web application was created in compliance to accessibility using semantic HTML and proper color palletes. Accessibility was tested with Dev Tool's Lighthouse and passed with 100% for this simple app.

Busines logic was covered with unit tests. For that purpose [Jasmine](https://jasmine.github.io/) was used, since it provides full testing suite with exprectations, matchers, async matchers and spies.

[nodemon](https://nodemon.io/) ensures fast development. It runs the code and automatically restarts the server when the code changes.

### Possible Improvements

When a developer creates application, there is almost always a possibility to improve it. This project is no exception :wink:.

#### PATCH request compliant with [JSON Patch format](http://jsonpatch.com/) specified in [RFC 6902](https://tools.ietf.org/html/rfc6902)

PATCH was chosen for the purpose of updating specific field of the existing resource. In current implementation the payload is a direct value of the field to be change, rather than an array of patch operations. In the ideal implementation compliant to the specification the payload should contain an object with there obligatory fields: `op`, `path`, `value`. So for the project it might look like:

```
[
  { "op": "replace", "path": "/issues/spme-id/status", "value": "pending" }
]
```

Not only payload should be handled this way, but a mechanism with validation for resources should be implemented. Server should control which operations can be run on which resource and which values can be modified.

#### CSS styles for compatibility with older browsers

Styles applied to the project might be reviewed for purpose of reaching bigger compatibility. For example, `flexbox` used for positioning should be assisted with `webkit` and `ms` prefixes as provided in [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Backwards_Compatibility_of_Flexbox#common_issues).

#### JavaScript transpiled to ES5 for compatibility with older browsers

JavaScript written in the project uses arrow function expressions, specific array functions such as `includes`, Promises with async/await to handle asyncronicity. Currently those featues are supported in modern web apps, but it's a good trait not to discriminate users of the older ones.

#### Reload side partially, not entirely to retrieve updated issues

When request to change the status is fulfilled successfully [Location API](https://developer.mozilla.org/en-US/docs/Web/API/Location) was used to refresh the page and fill it with updated issues. At first glance it might not be a big problem, since it delivers the up-to-date tracker - this is expected, but it's usually not a good practice to loose the current context of the web app just becasue user interacted with it. This may lead to problems with loosig focus if there is need to implement functionality to go thorugh the list one by one and not coming back to the first element after reload. In this scenario it would be reasonable to use some reactive front-end framework/library, which make it easier to preserve the view, get updated data and re-render it with the indexed list view.
