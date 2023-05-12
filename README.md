# PROFFICE
### CSC 4307 Agile Software Engineering and DevOps class project

#### About
For AUI students and faculty members who need most up-to-date office hours information and book them, the Proffice is web-based platform that allows the students to easily find any professor’s office hours, location, availability, and be able to digitally book an appointment with them. Unlike the traditional approach of email appointments, Facebook posts and waiting in queues, the Proffice is faster, more organized, and enables more meaningful meetings as well as synchronized office booking.

#### Demo
[Link to the demo](https://alakhawayn365-my.sharepoint.com/:v:/r/personal/o_essfadi_aui_ma/Documents/AUI%20Docs/Spring%202023/Agile/Proffice%20Demo%20Video/Demo%20Video.mp4?csf=1&web=1&e=zIzhUZ)

#### Get Started
##### Pre-requisites
- Node.js
- NPM
- Postgres
- Docker (optional)

1. Create a `.env` file to store environment variables

###### With Docker
2. Build and run the Docker container using `docker-compose up`

###### Without Docker
2. Install dependencies `npm i`
3. Setup the database `npx prisma db push`
4. Run the project `npm run dev`
