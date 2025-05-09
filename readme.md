# Student Portal

This is a web application for managing student projects, announcements, and wishlists. The platform allows students to view available projects, add them to their wishlist, and get announcements related to their fields of study.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Routes](#routes)
7. [Contributing](#contributing)
8. [License](#license)

## Overview

This project is built to help students manage their academic journey by allowing them to view projects in their field, add projects to their wishlist, and stay updated with announcements. Admin users can manage the projects and announcements, while students can interact with available projects and manage their own wishlists.

### Features

* **Student Dashboard**:

  * View available projects.
  * Add projects to wishlist.
  * View and filter announcements.
* **Admin Dashboard**:

  * Manage (add/edit/delete) projects.
  * Manage (add/edit/delete) announcements.
* **Wishlist Functionality**:

  * Students can add or remove projects from their wishlist.
  * Projects are marked as "added" once a student adds them to their wishlist.
* **Announcements**:

  * Students can filter announcements by their field of study (general, computer science, math, physics, chemistry).
  * Admin can post new announcements, which are then visible to students.

## Tech Stack

* **Backend**: Node.js, Express.js, Mongoose (MongoDB ORM)
* **Frontend**: EJS (Embedded JavaScript Templates), Tailwind CSS for styling, FontAwesome for icons
* **Database**: MongoDB
* **Authentication**: JWT (JSON Web Tokens) for securing routes and user sessions

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/your-username/project-name.git
cd project-name
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables. Create a `.env` file in the root of the project and add the following:

```env
MONGO_URI=your_mongo_database_uri
JWT_SECRET=your_jwt_secret
PORT=3000
```

4. Run the application:

```bash
npm start
```

The server will start on `http://localhost:3000`.

## Usage

* **Admin**: Log in to the admin dashboard with the following credentials:

  * **Email**: [admin@gmail.com](mailto:admin@gmail.com)
  * **Password**: 123

* **Students**: Log in to the student dashboard with the following credentials:

  * **Email**: [amine@gmail.com](mailto:amine@gmail.com), [yacine@gmail.com](mailto:yacine@gmail.com), [aissa@gmail.com](mailto:aissa@gmail.com)
  * **Password**: 123

Once logged in, students will have access to the following features:

* View available projects.
* Add projects to their wishlist.
* View filtered announcements.

### Routes

Here are the main routes for the application:

* **GET /student/projects**: Displays a list of available projects for students to view.
* **GET /student/wishlist**: Displays the student's wishlist.
* **GET /student/announcements**: Displays announcements, optionally filtered by category (e.g., `general`, `computer_science`).
* **POST /api/wishlists**: Add a project to the wishlist.
* **POST /api/announcements** (Admin only): Add new announcements.

### Admin Routes

* **POST /admin/projects**: Add a new project.
* **PUT /admin/projects/\:id**: Edit a project.
* **DELETE /admin/projects/\:id**: Delete a project.
* **POST /admin/announcements**: Add a new announcement.
* **PUT /admin/announcements/\:id**: Edit an announcement.
* **DELETE /admin/announcements/\:id**: Delete an announcement.

## Contributing

Feel free to fork this repository and make contributions. Here are some ways you can help:

* Improve documentation.
* Fix bugs or enhance features.
* Add unit tests for the existing codebase.

To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to your branch (`git push origin feature-name`).
6. Create a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
