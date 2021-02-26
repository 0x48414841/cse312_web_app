FROM node:13
# Set the home directory to /root
ENV HOME /root
ENV CLI /root/client
ENV MONGO_URI mongodb://mongo:27017/db
# cd into the home directory
WORKDIR /root
# Copy all app files into the image
COPY . .
# Download dependancies
RUN npm install
# Allow port 3000 to be accessed from outside the container 
EXPOSE 3000
EXPOSE 5000
# Run the app
CMD cd client; npm install; cd /root; npm run dev-docker