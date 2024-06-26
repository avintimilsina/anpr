<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://parksathi.vercel.app">
    <img src="frontend/public/logo.svg" alt="Logo" width="160" height="80"/>
  </a>

  <h3 align="center">ParkSathi</h3>

  <p align="center">
    Where Parking Hassles Become History 🚙
    <br />

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/works-on-my-machine.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/powered-by-coffee.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/uses-brains.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/made-with-python.svg)](https://forthebadge.com)

</div>

## About The Project

| File     | Link                              |
| -------- | ---------------------------------------- |
| Report      | [FinalProjectReport.pdf](./documents/FinalProjectReport.pdf)   |
| Report (Editable Document)      | [FinalProjectReport.docx](./documents/FinalProjectReport.docx)   |
| Presentation      | [FinalProjectReport.pptx](./documents/FinalProjectReport.pptx)   |

ParkSathi is a project aimed at revolutionizing the parking experience. With a focus on simplicity and efficiency, ParkSathi offers a smart parking solution that benefits both parking providers and users alike. Leveraging advanced tools such as YOLOv8 for object detection and EasyOCR for character recognition, ParkSathi ensures seamless parking spot identification and vehicle information processing.

By utilizing YOLOv8, ParkSathi accurately detects and locates cars, providing admin with up-to-date vehicle information. Additionally, EasyOCR facilitates the swift recognition of vehicle license plates,streamlining the registration process and enabling effortless time-based billing.
Through the integration of these technologies, ParkSathi delivers a user-friendly and efficient parking solution that revolutionizes urban mobility.

ParkSathi is transforming the way we think about parking, making urban life more manageable and stress-free for everyone involved.

<video src="./documents/reports/ParkingSolution.mp4"></video>

## Built With

<div style="display: flex; flex-wrap: wrap;">
<img src="https://img.icons8.com/color/48/000000/typescript.png" title="Typescript" alt="Typescript" width="50" height="50" />
<img src="https://img.icons8.com/color/48/000000/react-native.png" title="React" alt="React" width="50" height="50" />
<img src="https://img.icons8.com/color/48/000000/python.png" title="Python" alt="Pyhton" width="50" height="50" />
<img src="https://img.icons8.com/color/48/000000/nextjs.png" title="Nextjs" alt="Nextjs" width="50" height="50" />
<img src="https://img.icons8.com/color/48/000000/tailwindcss.png" title="Tailwind" alt="Tailwind" width="50" height="50" />
<img src="https://img.icons8.com/color/48/000000/firebase.png" title="Firebase" alt="Firebase" width="50" height="50" />
<img src="https://img.icons8.com/color/48/000000/figma.png" title="Figma" alt="Figma" width="50" height="50" />
<img width="50" height="50" src="https://img.icons8.com/dusk/64/postman-api.png" title="Postman API" alt="Postman API"/>
</div>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple example steps.

### Installation

1. Clone the repo
   ```sh copy
   git clone https://github.com/avintimilsina/anpr.git
   ```
2. Install the project dependencies

   ```sh copy
   pnpm install
   ```

3. Rename the `env.example` to `env.local` & update you enviroment variables in all the apps.

   ```js
   API_KEY = YOUR_API_KEY;
   ```

4. Run the following commands to start the development server

   ```sh copy
   pnpm dev
   ```

### To Initialize The Backend

1. Navigate to the api folder.
   ```sh copy
   cd anpr/api
   ```
2. Create a virtual environment for the kernel

   For Windows:

   ```powershell copy
   pythom -m venv venv
   venv\Scripts\Activate.ps1
   ```

   For Linux:

   ```sh copy
   pythom -m venv venv
   source venv/bin/activate.fish
   ```

3. Install the python dependencies.

   ```sh copy
   pip install -r requirements.txt
   ```

4. Run the following commands to start the backend server

   ```sh copy
   python main.py
   ```

## Apps

| Apps     | Description                              |
| -------- | ---------------------------------------- |
| api      | Python Server for the infrastructure     |
| frontend | Frontend Nextjs app for end users        |
| model    | Custom model for license plate detection |
| notebook | Documentation for python code            |

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<!-- CONTACT -->

## Contact

<div align="center">
  <a href="mailto:avin.timilsina.16@gmail.com"><img src="https://img.shields.io/badge/gmail-%23D14836.svg?&style=for-the-badge&logo=gmail&logoColor=white" /></a>&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://www.facebook.com/avin.timilsina.16/"><img src="https://img.shields.io/badge/facebook-%233B5998.svg?&style=for-the-badge&logo=facebook&logoColor=white" /></a>&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://www.instagram.com/avin_timilsina/"><img src="https://img.shields.io/badge/instagram-%23dc2743.svg?&style=for-the-badge&logo=instagram&logoColor=white" /></a>&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://www.linkedin.com/in/abintimilsina/"><img src="https://img.shields.io/badge/linkedin-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white" /></a>&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://twitter.com/avin_timilsina"><img src="https://img.shields.io/badge/twitter-%231DA1F2.svg?&style=for-the-badge&logo=twitter&logoColor=white" /></a>&nbsp;&nbsp;&nbsp;&nbsp;
  </a>

</div>
