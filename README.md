# theater_back

> Personal Blog With Concept: Theater

## Introduction

This is the backend-side of my Blog Application.
You can check out the [Frontend-side](https://github.com/nant0313/theater_front) also.



### Built With

Node.js, Socket.io



### Setting up Dev

1. With command below you will get a clone of this repository.

```shell
git clone https://github.com/nant0313/theater_back
```

2. And next install all of the dependencies required for this project

```shell
npm install
```

3. Run nodemon

```shell
npm run dev
```



### Deploying / Publishing

The Command below will run `node server.js` and start server-side rendering for SEO (Search Engine Optimization).

```shell
npm start
```



## Database

In this project you need to add `.env` file to main directory.
Please fill In the blanks below and add to `.env` file.

```
MYSQL2_HOST=
MYSQL2_USER=
MYSQL2_PW=
MYSQL2_DB=

KAFKA_HOST=

GMAIL_EMAIL=
GMAIL_PW=
```

`GMAIL_EMAIL`and `GMAIL_PW` is used to send email with it (Gmail SMTP), when blog comment has been reported.  
`KAFKA_HOST` is used to add log data to kafka.


TABLE - story

```sql
CREATE TABLE `story` (
    `idx` int NOT NULL AUTO_INCREMENT,
    `writer` int NOT NULL DEFAULT '0',
    `mainCatIdx` int NOT NULL,
    `subCatIdx` int NOT NULL,
    `title` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
    `date` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
    `location` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
    `content` longtext CHARACTER SET utf8 COLLATE utf8_general_ci,
    `likes` int NOT NULL DEFAULT '0',
    `hits` int NOT NULL DEFAULT '0',
    `outerColor` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '#F1F1F1',
    `innerColor` varchar(20) NOT NULL DEFAULT '#FFFFFF',
    PRIMARY KEY (`idx`),
    KEY `mainCatIdx` (`mainCatIdx`),
    KEY `subCatIdx` (`subCatIdx`),
    CONSTRAINT `mainCatIdx` FOREIGN KEY (`mainCatIdx`) REFERENCES `mainCategory` (`mainIdx`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `subCatIdx` FOREIGN KEY (`subCatIdx`) REFERENCES `subCategory` (`subIdx`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```



TABLE - mainCategory

```sql
CREATE TABLE `mainCategory` (
    `mainIdx` int NOT NULL AUTO_INCREMENT,
    `mainCategory` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    PRIMARY KEY (`mainIdx`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```



TABLE - subCategory

```sql
CREATE TABLE `subCategory` (
    `subIdx` int NOT NULL AUTO_INCREMENT,
    `mainCatIdx` int NOT NULL,
    `subCategory` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    PRIMARY KEY (`subIdx`),
    KEY `subCategory_ibfk_1` (`mainCatIdx`),
    CONSTRAINT `subCategory_ibfk_1` FOREIGN KEY (`mainCatIdx`) REFERENCES `mainCategory` (`mainIdx`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```



TABLE - comment

```sql
CREATE TABLE `comment` (
    `mainIdx` int NOT NULL AUTO_INCREMENT,
    `storyId` int NOT NULL,
    `mainWriter` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '-1',
    `mainDate` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `mainContent` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
    `likes` int DEFAULT '0',
    `ip` text NOT NULL,
    `mainReport` int DEFAULT '0',
    PRIMARY KEY (`mainIdx`),
    KEY `storyId` (`storyId`),
    CONSTRAINT `storyId` FOREIGN KEY (`storyId`) REFERENCES `story` (`idx`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```



TABLE - subComment

```sql
CREATE TABLE `subComment` (
    `subIdx` int NOT NULL AUTO_INCREMENT,
    `storyId` int NOT NULL,
    `commentId` int NOT NULL,
    `subWriter` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '-1',
    `subDate` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `subContent` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `likes` int DEFAULT '0',
    `ip` text,
    `subReport` int DEFAULT '0',
    PRIMARY KEY (`subIdx`),
    KEY `commentId-SubComment` (`commentId`),
    KEY `storyId-SubComment` (`storyId`),
    CONSTRAINT `commentId-SubComment` FOREIGN KEY (`commentId`) REFERENCES `comment` (`mainIdx`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `storyId-SubComment` FOREIGN KEY (`storyId`) REFERENCES `story` (`idx`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```



TABLE - tmpStory (To Temporily Save Stories While Writing)

```sql
CREATE TABLE `tmpStory` (
    `idx` int NOT NULL AUTO_INCREMENT,
    `writer` int NOT NULL DEFAULT '0',
    `mainCatIdx` int NOT NULL,
    `subCatIdx` int NOT NULL,
    `title` text,
    `date` text,
    `location` text,
    `content` longtext,
    `likes` int NOT NULL DEFAULT '0',
    `hits` int NOT NULL DEFAULT '0',
    `outerColor` varchar(20) NOT NULL DEFAULT '#F1F1F1',
    `innerColor` varchar(20) NOT NULL DEFAULT '#FFFFFF',
    PRIMARY KEY (`idx`),
    KEY `mainCatIdx_tmp` (`mainCatIdx`),
    KEY `subCatIdx_tmp` (`subCatIdx`),
    CONSTRAINT `mainCatIdx_tmp` FOREIGN KEY (`mainCatIdx`) REFERENCES `mainCategory` (`mainIdx`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `subCatIdx_tmp` FOREIGN KEY (`subCatIdx`) REFERENCES `subCategory` (`subIdx`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```



## Todo

- 
