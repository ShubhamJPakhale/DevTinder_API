# DevTinder APIsAdd commentMore actions

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password -- for forget password 

## connectionRequestRouter
- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId

## userRouter
- GET /user/connections
- GET /user/requests/received
- GET /user/requests/sent
- GET /user/feed - Gets you the profiles of other users on platform


Status: ignore, interested, accepted, rejected