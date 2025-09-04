# Learning Language Project

## Step 1:

- clone project

## Step 2: Environment setup

- install docker: cd docker run docker-compose up -d
- Start Database with Docker: Install and Configure Prisma

```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```

- Create .env file then open the .env file and update the DATABASE_URL variable to point to your Docker database.

```
DATABASE_URL="postgresql://lang_user:strongpassword123@localhost:5432/language_learning"
```

- Run command:

```
npx prisma migrate dev --name init
```

## Step 3: Test

- Run command: `npx prisma studio` to view database in browser
- Check if the tables have been created by opening a terminal and connecting to the database using the command:

```
# check container status & logs
docker compose -f docker/docker-compose.yml ps
docker compose -f docker/docker-compose.yml logs db --tail 200

# connect into the container to inspect DB
docker exec -it language_learning_db psql -U lang_user -d language_learning
# inside psql, check tables:
\dt
```

## Format code:

- Check for issues: npm run lint
- Auto-fix issues: npm run lint:fix
