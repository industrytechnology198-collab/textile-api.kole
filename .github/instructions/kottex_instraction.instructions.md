---
description: Describe when these instructions should be loaded by the agent based on task context
# applyTo: 'Describe when these instructions should be loaded by the agent based on task context' # when provided, instructions will automatically be added to the request context when the pattern matches an attached file
---

<!-- Tip: Use /create-instructions in chat to generate content with agent assistance -->

---
description: Describe when these instructions should be loaded by the agent based on task context
# applyTo: 'Describe when these instructions should be loaded by the agent based on task context' # when provided, instructions will automatically be added to the request context when the pattern matches an attached file
---

<!-- Tip: Use /create-instructions in chat to generate content with agent assistance -->

# Backend Architecture Instructions (NestJS)

## 1. Core Principle

You MUST follow this flow strictly:

Controller → Service → Handler → Repository → Database

Each layer has ONE responsibility. No overlap.

---

## 2. Module Structure (Mandatory)

Each module MUST follow:

/<module-name>
/decorators
/dto
/handlers
/repositories

<module>.controller.ts <module>.service.ts <module>.module.ts

---

## 3. Controllers

Responsibilities:

* Handle HTTP requests
* Extract input (@Body, @Param, @Query)
* Call service
* Return response

Rules:

* ❌ No business logic
* ❌ No database access
* ❌ No validation logic
* ❌ No complex conditions
* ❌ No Swagger code inside

---

## 4. Services (Facade Layer)

Responsibilities:

* Delegate calls to handlers

Rules:

* ❌ No business logic
* ❌ No database access
* ❌ No validation
* Only call handlers

Example:

create(dto) {
return this.createHandler.execute(dto);
}

---

## 5. Handlers (Business Logic Layer)

Responsibilities:

* One handler = one use case
* Contains ALL business logic

Rules:

* ✅ Validate domain rules
* ✅ Throw proper exceptions (NotFound, Conflict, BadRequest)
* ✅ Call repositories
* ❌ No direct Prisma usage

Examples:

* Check uniqueness
* Check existence
* Apply business constraints

---

## 6. Repositories

Responsibilities:

* Handle ALL database operations (Prisma)

Rules:

* ❌ No business logic
* ❌ No validation
* Only queries

Examples:

* findById
* create
* update
* delete

---

## 7. DTOs (Data Transfer Objects)

Responsibilities:

* Validate request data
* Define input/output structure

Rules:

* One DTO per use case
* Use class-validator
* No business logic

---

## 8. Decorators (Swagger)

Responsibilities:

* Store ALL Swagger documentation

Rules:

* Controllers must stay clean
* Each endpoint has its own decorator

---

## 9. Error Handling

Rules:

* Use NestJS exceptions only:

  * NotFoundException
  * ConflictException
  * BadRequestException

* ❌ No manual error objects

* ❌ No silent failures

---

## 10. Naming Conventions

Handlers:

* FolderCreateHandler
* FolderUpdateNameHandler

DTOs:

* CreateFolderDto
* UpdateFolderNameDto

Repositories:

* FolderRepository

Methods:

* createOne
* findAll
* findById
* updateName
* deleteOne

---

## 11. Database Rules (Prisma)

* All DB access goes through repositories
* Use indexes for frequent queries
* Enforce constraints at DB level (unique, relations)
* Never trust only application logic

---

## 12. Code Rules

* Keep functions small
* Use early returns
* Avoid duplication
* One responsibility per file
* No dead code

---

## 13. Forbidden Practices

* ❌ Prisma in controllers/services/handlers
* ❌ Business logic in controllers
* ❌ Fat services
* ❌ Shared business logic in utils/helpers
* ❌ Direct cross-module DB access
* ❌ Storing runtime data in .env

---

## 14. Project & Folder Rules

* projectId is a stable identifier (can be stored in .env)
* Folder belongs to a project
* Enforce uniqueness at DB level
* Always validate project boundaries in handlers

---

## 15. Consistency Rule (Critical)

If a feature does not follow this structure → it is rejected.

No exceptions.
