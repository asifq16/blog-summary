# Documentation

## Steps :-

## 1. node version used 18.10.0

## 2. yarn

## 3. create .env file

```

# Database credentials

DB_PORT= <port>
DB_HOST= <host>
DB_USERNAME= <username>
DB_PASSWORD= <password>
DB_NAME= <name>

# OPEN AI KEY

OPEN_AI_KEY=<DB key>

NODE_ENV= <dev||env>
```

## 4. Server should be up and running at this stage

## API's
### /article [POST]
#### Api will be used to save summary.
```
body:{
  data: [
    {
      summary: string;
      url: string;
      text: string;
    },
  ]
}
```
### /article-summary [POST]
#### Api will be used to get summary of bbc articles from the urls array .
```
body:{
  urls: [string]
}
```
## Note :-

```
  The following features can be added with the existing code :-
    - [/] User association with articles
    - [/] Articles can be retrieved with article code (you can see it in response of /article api)
    - [/] etc

  As features mentioned above is out of the scope of task sheet.Hence, not implemented.

```
