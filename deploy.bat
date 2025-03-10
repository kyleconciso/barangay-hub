@REM build client, copy to server public 

cd client

npm run build

xcopy build\* ..\server\public\ /e /h /c/ /i

cd ..

@REM copy configs

xcopy config\clientConfig.js client\src\api\config.js /y /i

xcopy config\serviceAccountKey.json server\config\serviceAccountKey.json /y /i


@REM server docker build 

cd server

gcloud config set project barangay-server

docker build -t gcr.io/barangay-server/express-app .

docker push gcr.io/barangay-server/express-app

gcloud run deploy express-app \
  --image gcr.io/barangay-server/express-app \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated

