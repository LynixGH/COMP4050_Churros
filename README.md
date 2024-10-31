# COMP4050 VivaMQ Churros Frontend

## Description

This is the Github Repository of the COMP4050 2024 Session 2 Churros team in the Espana division. The code base is created using the next.js framework. It was worked on by Mark Ghaby, Thomas Bevan, Vivian Wu, Darrell Jun Zhen Lim & Keval Kaushalbhai Gandhi.

This codebase provides the frontend to the Espana division's solution to the client issue proposed to us at the beginning of the semester. It ultimately provides the user interface to interact with the VivaMQ system which has authentication capabilities, and the ability to create units and assignments for viva voce assignment creation, based on other students submissions. There is also the capabilities of creating a rubric for an assignment based on a description, criterions and ULOs, as well as the ability to convert an existing marking guide to a marking rubric. The true power comes from this all being powered by AI, which the Capote team handled.

## Build Instructions

First, set up the node modules:
```bash
npm install next@latest react@latest react-dom@latest
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Third-Party Code Usage

The list of third-party code is as below:

* [Axios](https://axios-http.com/docs/intro)
* [TailwindCSS](https://tailwindcss.com/docs/installation)

## Acknowledgements

We would like to acknowledge Asngar and Kate for putting the unit together as well as supervising and providing us guidance throughout the semester. We would also like to acknowledge, Carl, Luke and Matt for acting as clients to simulate real-world experiences and provide us with the opportunity to learn from. Additionally, we would like to acknowledge Suhaas Gambhir from the Capote team, Mifta Alam and Himanshi Garg from the Cordoba team for their contributions and assistance to the creation of this codebase. 

## Codebase Description

All source code can be found within the `/src` directory. Inside is the `/components` directory which contains code for the menu component we call. There is also an `api.tsx` file which holds all the API constants we use to interact with the backend. There is also an `app` directory, which is where the core functionality can be found. Here there is another `/components` directory which holds a lot of the shared components used throughout the app, there is the `(dashboard)` directory which is nested inside (for routing purposes) holds the main dashbaord of the app, the rubric generation code for requirements 6.1 and 6.2, and the `/userDashboard` which nested inside of that holds the code for the viva voce generation functionality. More details can be found in the developer manual.
