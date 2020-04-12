# Universal Users System (UUS)

It's a **free** and **open source** microservice alternative to all authorization, autentification and indentification solitions.

[API Docs (Work in Progress)](https://share.clickup.com/p/2cn1v-203/uus-api-docs)

## Advantages
- Free and open source
- Light and secure
- MongoDB storage system
- Easy to install and use in Docker container
- User profile images support
- JWT based

## Instalation

### Requirements
- Node.js [>12]
- MongoDB [>3]

### Instalation on your own
1. Download repo 
```
$ git clone https://github.com/Mvtthew/uus
```
2. Install node dependencies 
```
$ npm i
```
3. Edit configuration files 
```
/config/config.js
```
4. Run uus server 
```
$ npm run start
```


### Running in docker container
> Docker [>19] * Docker-compose required 
1. Download repo 
```
$ git clone https://github.com/Mvtthew/uus
```
2. Set up your docker image 
```
$ docker-compose build
```
3. Run docker image 
```
$ docker-compose up
```

## Todo's and future features of UUS
[ ] User roles  
[ ] Permissions  
[ ] Permissions linked to roles  
[ ] Editable and scalable users/roles system