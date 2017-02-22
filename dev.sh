npm install --dev
while inotifywait -e modify,close_write,move_self -q *.js *.html
do 
  kill `cat .pid`
  sleep 0.1
  (sleep 0.5; curl -X POST -d 'console.log("hi");' http://localhost:8888/hash ) &
  (sleep 1; curl http://localhost:8888/hash/6327935c4103bdd527e12104) &
  node code-storage.js $@ &
  echo $! > .pid
  sleep 3
done
