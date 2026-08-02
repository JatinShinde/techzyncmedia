# Production Dockerfile for Techzyncmedia Java Spring Boot 3 App
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copy Maven Wrapper and POM
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw

# Copy source code and build executable JAR
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Expose Spring Boot default port
EXPOSE 8080

# Run Spring Boot Application
ENTRYPOINT ["java", "-jar", "target/backend-0.0.1-SNAPSHOT.jar"]
