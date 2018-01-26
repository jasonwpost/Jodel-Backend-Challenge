sudo docker run -p "27017:27017" \
-e "MONGO_INITDB_ROOT_USERNAME=user" \
-e "MONGO_INITDB_ROOT_PASSWORD=password" \
-v "./data/data/db" --hostname mongodb \
--name mongo -d mongo
sudo docker run -p "6379:6379" \
-v "../data/redis/data" \
--name redis -d redis 
npm install
npm run local
