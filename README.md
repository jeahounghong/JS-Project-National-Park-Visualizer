# National Park Visualizer

## Background


## Functionality & MVPs
In the National Park visualizer, users will be able to:
- View all of the national parks in the 50 US States
- Zoom into a state to view the state's national parks
- Upon clicking on a national park, be able to see photos of the park as well as see a description, activities, and user reviews
- Search for specific terms such as the name, activities, etc.

In addition, this project will include:
- Sidebar instruction
- README
- Future features:
    - Documentation
    - Tests

## Wireframes
![Layout upon first loading the page](/wireframes/wireframe_1.png?raw=true)
![Layout upon clicking on a state](/wireframes/wireframe_2.png?raw=true)
![Layout upon clicking on a park](/wireframes/wireframe_3.png?raw=true)

## Technologies, Libraries, APIs
- D3 geo: Used for generating a map of the USA using geoAlbers projection
- Parks API: Used for gathering data of national parks
- Flickr API: Used for fetching and rendering user photos 
- AllTrails API: Used for gathering hiking information about parks

## Implementation Timeline
- 07/22/22 - Create basic HTML skeleton of relevant banners, forms, search bars, etc. Create functionality for AJAX requests for searching by keywords on specific parks. This should also apply to the native filters that are embedded within the SPA.
- 07/24/22 - Create functionality to open a popup upon clicking on a park. "X"ing out of the park should unselect park, re-render the filters and parks in that state. Potentially implement lightweight backend to hide API keys, allow for CORS proxy.
- 07/25/22 - Create functionality to populate the popup upon request. It should draw images from the Flickr API, fetch reviews from AllTrails API, create descriptions and list of activities from Parks API
-07/26/22 - Troubleshooting, refactoring, and CSS Styling
-07/27/22 - Troubleshooting, refactoring, and CSS Styling. Finalize presentation.
