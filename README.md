# 🙆🙋Universal Users System (UUS)
>By Mateusz Ożóg

It's a **free** and **open source** micro service alternative to all authorization, authentication and identification solutions.

[📄 API Docs (Work in Progress)](https://share.clickup.com/p/2cn1v-203/uus-api-docs)

## ➕ Advantages
✔️ Free and open source  
✔️ Light and secure  
✔️ MongoDB storage system  
✔️ Easy to install and use in Docker container  
✔️ User profile images support  
✔️ JWT based   
✔️ Logs + actions logging

## 💻 Installation

### 📦 Requirements
- Node.js [>12]
- MongoDB [>3]

### 📄 Installation on your own
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


### 🐳 Running in docker container
> Docker [>19] and compose required 
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