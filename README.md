# Cake Delight

Cake Delight is a cloud-native microservices application built with Spring Boot, MongoDB, RabbitMQ, Docker, Kubernetes, and a lightweight HTML/CSS/JavaScript frontend.

The application supports the complete customer journey from browsing cakes through checkout, rating, and asynchronous order-confirmation email notification.

## 1. Architecture

The application consists of four backend microservices and one frontend:

| Component | Technology | Port | Responsibility |
|---|---|---:|---|
| Catalog Service | Spring Boot + MongoDB | 8081 | Cake catalog, CRUD, search and filtering |
| Order Service | Spring Boot + MongoDB + RabbitMQ | 8082 | Basket management, checkout and orders |
| Rating Service | Spring Boot + MongoDB | 8083 | Ratings, reviews and average ratings |
| Notification Service | Spring Boot + RabbitMQ + SMTP | 8084 | Consumes order events and sends confirmation emails |
| Frontend | HTML/CSS/JavaScript + Nginx | 80 | Customer-facing application |
| MongoDB | MongoDB 7 | 27017 | Persistence for catalog, orders/baskets and ratings |
| RabbitMQ | RabbitMQ 3 Management | 5672 / 15672 | Event-driven communication |

The Order Service publishes an `OrderCompletedEvent` to RabbitMQ after a successful checkout. The Notification Service consumes the event and sends the order-confirmation email.

## 2. Project Structure

```text
CakeDelight/
├── cake-catalog-service/
├── order-service/
├── rating-service/
├── notification-service/
├── frontend/
├── k8s/
├── docker-compose.yml
├── .env
└── README.md
```

The `target/` directories are generated Maven build artifacts and are intentionally excluded from Git.

## 3. Prerequisites

Install the following:

- Java 17
- Docker Desktop
- Docker Compose
- kubectl
- Minikube

Verify the tools in PowerShell:

```powershell
java -version
docker --version
docker compose version
kubectl version --client
minikube version
```

## 4. Configuration

Do not commit credentials to Git.

The Notification Service expects:

```text
MAIL_USERNAME=<SMTP username>
MAIL_PASSWORD=<SMTP password or application password>
```

The local Docker Compose configuration reads these values from `.env`.

For Kubernetes, the mail credentials are stored in the Kubernetes Secret named `mail-secret`.

Create the secret in PowerShell using the values from `.env`:

```powershell
kubectl create secret generic mail-secret `
  --from-literal=username="<MAIL_USERNAME>" `
  --from-literal=password="<MAIL_PASSWORD>"
```

If the secret already exists, delete and recreate it when necessary:

```powershell
kubectl delete secret mail-secret
```

## 5. Run with Docker Compose

From the project root:

```powershell
docker compose up --build
```

Check the containers:

```powershell
docker ps
```

The local Docker deployment exposes:

- Frontend: `http://localhost`
- Catalog Service: `http://localhost:8081`
- Order Service: `http://localhost:8082`
- Rating Service: `http://localhost:8083`
- Notification Service: `http://localhost:8084`
- MongoDB: `localhost:27017`
- RabbitMQ AMQP: `localhost:5672`
- RabbitMQ Management: `http://localhost:15672`

To stop the Docker deployment:

```powershell
docker compose down
```

## 6. Run with Kubernetes and Minikube

Start Minikube using Docker:

```powershell
minikube start --driver=docker
```

Verify the cluster:

```powershell
minikube status
kubectl config current-context
kubectl get nodes
```

The current context should be `minikube`.

## 7. Load Application Images into Minikube

Build the services first if the Docker images do not already exist.

Then load the local images into Minikube:

```powershell
minikube image load cakedelight-catalog:latest
minikube image load cakedelight-order:latest
minikube image load cakedelight-rating:latest
minikube image load cakedelight-notification:latest
minikube image load cakedelight-frontend:latest
```

The Kubernetes manifests use `imagePullPolicy: Never`, so Minikube uses these locally loaded images instead of pulling them from a registry.

## 8. Deploy Kubernetes Resources

Apply MongoDB and RabbitMQ first:

```powershell
kubectl apply -f .\k8s\mongodb.yaml
kubectl apply -f .\k8s\rabbitmq.yaml
```

Create the mail Secret:

```powershell
kubectl create secret generic mail-secret `
  --from-literal=username="<MAIL_USERNAME>" `
  --from-literal=password="<MAIL_PASSWORD>"
```

Then deploy the application services:

```powershell
kubectl apply -f .\k8s\catalog.yaml
kubectl apply -f .\k8s\order.yaml
kubectl apply -f .\k8s\rating.yaml
kubectl apply -f .\k8s\notification.yaml
kubectl apply -f .\k8s\frontend.yaml
```

Verify:

```powershell
kubectl get pods
kubectl get services
kubectl get deployments
```

All application pods should eventually show `1/1 Running`.

## 9. Access the Kubernetes Frontend

The frontend is exposed as a Kubernetes `NodePort`.

Use:

```powershell
minikube service frontend --url
```

Open the URL returned by Minikube in a browser.

Alternatively:

```powershell
minikube service frontend
```

## 10. Kubernetes Service Discovery

Inside the Kubernetes cluster, services communicate using Kubernetes Service names rather than localhost.

Examples:

```text
mongodb:27017
rabbitmq:5672
```

The Catalog Service connects to:

```text
mongodb://mongodb:27017/cake_catalog_db
```

The Order Service connects to:

```text
mongodb://mongodb:27017/order_db
```

The Rating Service connects to:

```text
mongodb://mongodb:27017/rating_db
```

The Order and Notification Services use the RabbitMQ Service named `rabbitmq`.

## 11. API Reference

### Catalog Service

Base path:

```text
/api/cakes
```

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/cakes` | List all cakes |
| GET | `/api/cakes/{cakeId}` | Retrieve a cake |
| POST | `/api/cakes` | Add a cake |
| PUT | `/api/cakes/{cakeId}` | Update a cake |
| DELETE | `/api/cakes/{cakeId}` | Delete a cake |
| GET | `/api/cakes/search` | Search/filter by name, category and price range |

Supported search parameters:

```text
name
category
minPrice
maxPrice
```

### Order Service

Base path:

```text
/api/orders
```

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/orders/cart?customerEmail={email}` | Add item to basket |
| GET | `/api/orders/cart/{customerEmail}` | Retrieve basket |
| PUT | `/api/orders/cart/{customerEmail}/{cakeId}?quantity={quantity}` | Update quantity |
| DELETE | `/api/orders/cart/{customerEmail}/{cakeId}` | Remove item |
| POST | `/api/orders/checkout` | Complete checkout and create order |
| GET | `/api/orders/{orderId}` | Retrieve an order |
| GET | `/api/orders/customer/{email}` | Retrieve customer orders |

### Rating Service

Base path:

```text
/api/ratings
```

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/ratings` | Submit a rating/review |
| GET | `/api/ratings/cake/{cakeId}` | Retrieve ratings for a cake |
| GET | `/api/ratings/cake/{cakeId}/average` | Retrieve average rating |
| GET | `/api/ratings/{ratingId}` | Retrieve a rating |
| DELETE | `/api/ratings/{ratingId}` | Delete a rating |

Ratings are validated from 1 to 5. Customer email is validated using email-format validation. Average ratings are rounded to one decimal place.

### Notification Service

The Notification Service is primarily event-driven.

It listens to:

```text
Exchange: order.exchange
Routing key: order.completed
Queue: order.notification.queue
```

A small notification controller is also present for the service's HTTP-facing functionality.

## 12. End-to-End Flow

1. The customer opens the Cake Delight frontend.
2. The frontend requests cakes from the Catalog Service.
3. The customer can filter cakes by name, category and price range.
4. Cakes are added to the browser basket.
5. During checkout, basket items are synchronized with the Order Service.
6. The Order Service creates and persists the order.
7. The Order Service publishes an `OrderCompletedEvent`.
8. RabbitMQ routes the event to `order.notification.queue`.
9. The Notification Service consumes the event.
10. The Notification Service sends an order-confirmation email using SMTP.
11. The customer can later view orders and submit ratings/reviews for cakes.

## 13. Event Contract

The order-completion event contains:

```text
orderId
customerName
email
phoneNumber
totalAmount
items
```

Each order item contains the information required by the notification service to include cake name, quantity, price and subtotal in the confirmation email.

## 14. Persistence

MongoDB is used by the data-owning services.

Separate databases are configured for:

```text
cake_catalog_db
order_db
rating_db
```

The Order Service stores both basket and order information.

The Rating Service stores ratings and reviews.

## 15. Docker

Each Spring Boot service has its own Dockerfile based on Eclipse Temurin JDK 17.

The frontend uses Nginx Alpine.

The Dockerfiles copy the Maven-built JAR from the corresponding `target/` directory into the container image.

Because `target/` is generated content, it is excluded from source control. Build the service before building its Docker image.

## 16. Kubernetes

The `k8s/` directory contains independent Kubernetes Deployment and Service definitions for:

```text
mongodb
rabbitmq
catalog
order
rating
notification
frontend
```

Backend services use `ClusterIP` Services for internal communication.

The frontend uses `NodePort` so it can be accessed through Minikube.

The Notification Service reads mail credentials from the Kubernetes `mail-secret`.

## 17. Health and Monitoring

The Spring Boot services expose Actuator health and information endpoints through the configured management settings.

The project also uses application logging and Kubernetes status/events for basic operational troubleshooting.

Useful commands:

```powershell
kubectl get pods
kubectl get services
kubectl get deployments
kubectl get events --sort-by=.lastTimestamp
kubectl logs <pod-name>
```

## 18. Troubleshooting

### Pod is not starting

Check:

```powershell
kubectl describe pod <pod-name>
kubectl get events --sort-by=.lastTimestamp
```

### Notification Service shows CreateContainerConfigError

Check that the Secret exists:

```powershell
kubectl get secret mail-secret
```

The Secret must contain both:

```text
username
password
```

After correcting the Secret:

```powershell
kubectl rollout restart deployment notification
```

### Frontend cannot be accessed

Check:

```powershell
kubectl get pods
kubectl get services
minikube service frontend --url
```

### Kubernetes image cannot be pulled

Because the manifests use `imagePullPolicy: Never`, load the image into Minikube:

```powershell
minikube image load cakedelight-catalog:latest
```

Repeat for the required service.

## 19. Stop and Restart

Stop Minikube:

```powershell
minikube stop
```

Start it again later:

```powershell
minikube start --driver=docker
```

Verify:

```powershell
minikube status
kubectl get nodes
kubectl get pods
```

The Kubernetes resources remain in the Minikube cluster unless the cluster is deleted.

To remove the Kubernetes resources:

```powershell
kubectl delete -f .\k8s\
```

To remove the Minikube cluster completely:

```powershell
minikube delete
```

## 20. Important Submission Notes

The repository should not contain:

- `.env` credentials
- Maven `target/` directories
- compiled `.class` files
- generated build artifacts

These are excluded through `.gitignore`.

The project is demonstrated locally using Docker Compose and Kubernetes through Minikube. It does not depend on a public cloud URL for the local demonstration.

The Kubernetes MongoDB manifest currently uses `emptyDir` storage. This provides storage for the running Minikube deployment but is not intended as production-grade persistent database storage.

The project does not implement a dedicated API Gateway. Client requests are routed directly to the required backend services.

## 21. Quick Verification

For Kubernetes:

```powershell
kubectl get pods
kubectl get services
kubectl get deployments
```

A healthy deployment should show all seven application/infrastructure deployments available:

```text
catalog
frontend
mongodb
notification
order
rabbitmq
rating
```

The frontend should be available through:

```powershell
minikube service frontend --url
```

A successful demonstration should cover:

```text
Browse cakes
→ Filter cakes
→ Add to basket
→ Modify basket
→ Checkout
→ Order created
→ RabbitMQ event published
→ Notification consumed
→ Confirmation email sent
→ Rating/review submitted
```

## 22. Conclusion

Cake Delight demonstrates the core principles required for a cloud-native microservices application: independently deployable services, REST APIs, database-backed persistence, containerization, Kubernetes orchestration, service discovery, asynchronous messaging, and event-driven notification processing.
