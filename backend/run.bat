set type=%1

IF "%type%" EQU "install" (
    set command=npm install
) ELSE (
    set command=npm start %type%
)

IF "%type%" EQU "" (
    set command=npm start
)

start cmd /k "cd microservices/community && npm start && exit" 
start cmd /k "cd microservices/posts && npm start && exit"
start cmd /k "cd microservices/reactions && npm start && exit"
start cmd /k "cd microservices/user && npm start && exit"
timeout /T 20
start cmd /k "cd microservices/gateway && node index.js"
