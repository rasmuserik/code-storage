npm install --dev
while inotifywait -e modify,close_write,move_self -q *.js *.html
do 
  kill `cat .pid`
  sleep 0.1
  (sleep 0.5; curl -X PUT -d 'console.log("hi");' http://localhost:8888/iyx8muyi0z8kflt ) &
  (sleep 1; curl http://localhost:8888/iyx8muyi0z8kflt ) &
  node code-storage.js $@ &
  echo $! > .pid
  sleep 3
done
