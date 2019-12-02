# Libero Reviewer Audit Service

This service listens for audit events and persists them

## Configuration

Copy the example config file

```sh
cp config/config.example.json config/config.json
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
