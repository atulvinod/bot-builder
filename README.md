# **BotMaker: A Flexible RAG Chatbot Builder**

## **Overview**

BotMaker empowers you to create Retrieval-Augmented-Generation (RAG) chatbots using files. It provides a user-friendly web interface built with Next.js and a robust backend architecture for efficient training and deployment.

## **Tech Stack**

-   **Frontend:**  Next.js 
-   **Data Management:**
    -   DrizzleORM ([https://github.com/drizzle-team/drizzle-orm](https://github.com/drizzle-team/drizzle-orm)) for data queries and migrations (Postgres)
    - Database hosted on Supabase.
    -   MongoDB for chat history
    -   Redis for caching and task queuing
-   **Authentication:**  NextAuth with Google OAuth ([https://next-auth.js.org/](https://next-auth.js.org/))
-   **Containerization & Deployment:**
    -   Docker for service isolation
    -   Docker Swarm for orchestrated deployment
    -   Render and DigitalOcean Droplet for hosting
-   **CI/CD:**  GitHub Actions
- **LLM:** OpenAI GPT-4
- **Email notifications:** Resend 

## **Microservices and Architecture**
- **Embedding Service**
	- Microservice responsible for creating vectors required for RAG.
	- Continously listens for tasks on a redis queue, pulls training files from Filebase storage for the task and uses LlamaIndex for creating vectors and Pinecone for storage of vectors.
	- Python application.
-  **Upload Service**
	- Handles requests related to creation of a bot, receives training files from `upload` endpoint, creates the bot details entry and training specifications and zips all the files related to the training and uploads it to Firebase storage.
	- Pushes the task to the redis queue so that the files can be converted to vectors by the embedding service.
	- Uses Fastify.
- **Chat Service**
	- An API service which handles requests related to a chat session, including chat-history, session management etc.
	- Provides an REST API for interfacing with LlamaIndex chatbot.
	- Uses Flask.

Try it out at https://bot-builder-henna.vercel.app/
