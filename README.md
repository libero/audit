# Libero Reviewer Audit Service

This service listens for audit events and persists them

## Configuration

Copy the .env.example file:

```sh
cp .env.example .env
```

## Setup

Create a database called 'reviewer_audit', then run the migrations:

```sh
yarn migrate run
```

To rollback one migration:
```sh
yarn migrate rollback
```

Migration status
```sh
yarn migrate status
```
