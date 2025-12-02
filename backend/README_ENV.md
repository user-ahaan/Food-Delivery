Environment variables required for backend:

- MONGODB_URI: MongoDB connection string
  Example: mongodb+srv://<username>:<password>@<cluster-host>/<db-name>?retryWrites=true&w=majority&appName=<appName>
- JWT_SECRET: Secret used to sign JWTs
- STRIPE_SECRET_KEY: Stripe secret key (only required if Stripe payments are enabled)
- PORT: Port for the server (default 4000) 