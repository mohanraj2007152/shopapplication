# shopapplication

# steps for running the application

npm install
change DB properties in 
shopapplication\util\database.js
npm start
# access the application
http://localhost:8080

# Exposed endpoinds for user operations 
1. add user
http://localhost:8080/auth/signup method PUT

{
    "name" : "mohan",
    "password" :"password",
    "email" : "mohan0045@gmail.com"
}

2. login 

http://localhost:8080/auth/login method POST

{
    
    "password" :"password",
    "email" : "mohan0045@gmail.com"
}

you will get the token after login

copy the token

// accessing below urls need pass token

bearer_token ="sfdsdfsad sfdf"


# Exposed endpoinds for product curd operations
1 . fetching all products
http://localhost:8080/admin/products Method get
2 . fetching product by i/1
http://localhost:8080/admin/product/1 Method get
3 . add product
http://localhost:8080/admin/product method post
{

"title":"A Book",
"imageUrl":"https://www.publicdomainpictures.net/pictures/10000/velka/1-1210009435EGmE.jpg",
"description":"This is an awesome book!",
"price":"19",
"userId" :1
}

4 . update product 
http://localhost:8080/admin/product method put

{"id":1,
"title":"A Book gg",
"imageUrl":"https://www.publicdomainpictures.net/pictures/10000/velka/1-1210009435EGmE.jpg",
"description":"This is an awesome book! updated",
"price":"19.25",
"userId" :1
}

4 delete product 
http://localhost:8080/admin/product/1 method delete

