# Chippo URL

## Tech Stack
- Deployment Service: Heroku
- Application: NodeJS, Express
- Storage: MongoDB
- Rendering: EJS
- Testing: Jest

## Security Issues
#### Cross-Site Scripting
- set Content-Security-Policy, X-Download-Options, Strict-Transport-Security, X-Frame-Options and X-XSS-Protection: use Helmet
- Hide X-Powered-By: use Helmet
- Sanitize request body and request query: use express-sanitizer
#### NoSQL Injection
- Use Joi combine with Celebrate to prevent injection

## Scalability Issues 
- Vertical Scaling use PM2 cluster to utilize CPU cores
- Horizontal Scaling use load balancer like Nginx to handle client
- Mongo Scaling use MongoDB Cluster