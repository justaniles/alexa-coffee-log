fileName=lambda-deploy.zip

[ -e "$fileName" ] && rm "$fileName"

# Zip up src files without src directory
cd ./src
zip -r ../$fileName . -i  '*.js'
cd ..

# Add node_modules
zip -ur $fileName node_modules

echo "Zip file '$fileName' ready for deployment."