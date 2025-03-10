@REM build client, copy to server public 

cd client

npm run build --silent

xcopy build\* ..\server\public\ /e /h /c /i /y

cd ..

@REM server docker build

cd server

docker build -t gcr.io/barangay-server/sanantonio-candoncity .

cd ..

