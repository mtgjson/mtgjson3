#!/bin/bash

pushd cache

for i in $( ls ); do
	gzip $i/*
done

popd