# wiivv-Etsy api
wiivv-Etsy is an API which gives user access to top products from etsy
* `/etsy-top-listing` API route gets top products from Etsy API and provides the list via an API in a list. 
  * The API paginates and return 10 products on a single page of the product listing.
  * Users can get the price converted to following currencies:GBP,CAD,USD,EUR
  * The response is an object with pagination information and array of results
* `/product` & `/product{product_id}` routes give support for:
  * `POST` allows admin accesslevel, to create a new product on our own database which users can access, it prevents duplicate products where a product with the same `title` and `type` exists, and has a valid url set as `thumbnail_url`
  * `GET` allows admin, editor, reader accesslevel to retrieve a list of products, with custom currency conversion, products can be sorted based on sort param and sort order
  * `PUT` allows admin, editor accesslevels to modify an existing product record.
  * `DELETE` allows admin accesslevel to delete a product from database.
* `/status` route gives the status of the service and its uptime


## Security
This service uses JWT security tokens, Use the website https://jwt.io/ to decode or generate a token. The secret you need to use will be defined as `jwt_api_token` in config file(This will differ depending on the environment)

wiivv-Etsy expects to receive the generated JWT token from Client (Through whatever authentication service they use) which should use the same jwt_api_token as we have in our config to encrypt the token.

example of a JWT payload:

```json
{
  "iss": "wiivv-Etsy",
  "role": "editor"
}
```

Only required filed on the paylod is the `role`, and valid values are: `admin`, `editor`, `reader`
JWT examples to be used for testing for each role:

`admin`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4ifQ.RRVsxXY60o76_XMi06K7Y0UkqwLiMPWJdYAPF0n52E4`
`editor`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZWRpdG9yIn0.cefNgSPr40VvHwYTvnsoKZ8kU819cdiTENeuaGZlMDk`
`reader`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoicmVhZGVyIn0.r7ukwCi75kmwBXdH3qEaXo2yz7FpkSS-uer3ZfmpneM`

Once our `JWTSecurityHelper` receives the JWT token, it uses the api_key defined in the config to decrypt the token and looks for the `role` property on it, and it will look through the `PermissionRoles` collection to find the list of accesses, and based on that each route will allow the user to use that specific route.

# Improvments

#### Authorization
We doing a simple authorization implementation, we need to use an authorization service with Oauth2 standard to save the user details and based on the role of the user to generate a jwt token to the service, this service should be able to create token and refresh token for longer authorizations

#### Caching
* Caching of the `ULR` for `etsy` requests set to `5min`
* Caching the `currency_quote` for currencylayer `5min` we could do better with time and try to get the exact time from the apis to determine the time to live.
* We currently using a caching library to help with caching the currency qoutes and the requests, it is fine for this implementation but for real life app, I prefer to use `Redis` service to keep the service stateless and make the scalability more efficient. 

#### Logging
* Need to add logging support to push logs to ElasticSearch

#### currency conversion
* the current subscription only exchanges based on `USD`, So we assuming all `currency_code` are in `USD` at the moment.for paid subscription we can use `currency_code` from etsy record and do a `&source=[currency_code]` to do the currency conversion accurately 


#### CI Setup
We only have an empty CI file which needs to be replaced with correct config depending on the CI service we use

#### Docker and Compose
Currently we only have templates in place, which need to be repalced with real settings

#### Error handling
We are doing a very simple error handling for this implementation, we can create error handling helper middlewares to handle the error in any format that we need and will usually contain some sort of an error code and message.

#### Private Methods
There are some private methods that can be moved into helper, handler folder to be reused, at the moment they are specific to that service, so no point in moving them now

#### Test cases
Currently there are only success test cases, we need to add more validation tests.