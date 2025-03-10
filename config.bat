@REM copy configs

xcopy config\clientConfig.js client\src\api\config.js /y /i

xcopy config\serviceAccountKey.json server\config\serviceAccountKey.json /y /i
