# Real-Time  Chat Application

## Table of Contents

- [Real-Time  Chat Application](#real-time--chat-application)
  - [Table of Contents](#table-of-contents)
  - [About <a name = "about"></a>](#about-)
  - [Getting Started <a name = "getting_started"></a>](#getting-started-)
    - [Prerequisites <a name = "prerequisites"></a>](#prerequisites-)
    - [Install & Run Application <a name = "installation"></a>](#install--run-application-)
    - [Demo <a name=demo></a>](#demo-)
  - [Author <a name = "author"></a>](#author-)

## About <a name = "about"></a>

Chat Application are surging in popularity. Real-Time chat, also known as online chat or live chat, is a way of communication and interaction in real-time on the website.

This application allow multiple users to chat together in a room or a private conversation. It allows to to only the authorised people to communicate with proper security.

## Getting Started <a name = "getting_started"></a>

This application is created with Asp.net Core as a server and angular as a client side. Making it real time using signalR.

### Prerequisites <a name = "prerequisites"></a>
* *Asp.net Core (v5.0)*
* *Angular (>= v6.0)*
* *NodeJs*
* *Microsoft Sql Server* 

### Install & Run Application <a name = "installation"></a>

* Open Command Prompt or Terminal and go to the prefered directory where the project will be cloned.
>```sh
>git clone 
>cd 
>```
* Go to *`back`* directory for server.
>```sh
>cd back
>```
* Change the ***Data Source*** of the "*DefaultConnection:*" from [*appsettings.json*](Back/appsettings.json) according to your local MSSQL Server credentials.
* Make Migrations
>```sh
> dotnet ef migrations add InitialCreate
> dotnet ef database update
>```
* Now build and run the server
>```sh
> dotnet build
> dotnet run
>```
* Go to *`front`* directory for server.
>```sh
> cd back
> ng build
> ng serve
>```
* Open a browser and browse to:
> [*http://localhost:4200/*](http://localhost:4200/)

And it's good to go.

### Demo <a name=demo></a>
&nbsp;&nbsp;&nbsp;&nbsp;![](_DemoImg\demo1.png) &nbsp;&nbsp; ![](_DemoImg\demo2.png)

## Author <a name = "author"></a>
&nbsp;&nbsp;&nbsp;  [*Mezbaul Islam Protick*](https://github.com/MIProtick)
