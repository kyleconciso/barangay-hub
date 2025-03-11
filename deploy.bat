@REM gcr deploy 

@REM gcloud config set project barangay-server --quiet

cd server

docker push gcr.io/barangay-server/sanantonio-candoncity

gcloud run deploy sanantonio-candoncity --image gcr.io/barangay-server/sanantonio-candoncity --platform managed --region asia-east1 --allow-unauthenticated

cd ..