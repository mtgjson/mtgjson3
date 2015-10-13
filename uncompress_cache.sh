#!/bin/bash

pushd cache

for i in $( ls ); do
	gunzip $i/*
done

popd