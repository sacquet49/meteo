#!/bin/sh -e

for i in {1..12}
do
   for i in {1..31}
    do
        babel-node getMeteo.js $i $j
    done
done
