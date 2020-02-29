#!/bin/bash

d=`realpath $(dirname ${BASH_SOURCE[0]})`
pushd $d
. $d/.venv/bin/activate
if [ $(node --version) != "v10.16.0" ]; then
	>&2 echo "wrong node version $(node --version)"
	popd
	deactivate
	exit 1
fi
if [ ! -d node_modules ]; then
	npm install
fi
alias truffle=$d/node_modules/truffle/build/cli.bundled.js
popd
