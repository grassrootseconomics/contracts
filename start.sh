#!/bin/bash

d=`realpath $(dirname ${BASH_SOURCE[0]})`
pushd $d
. $d/.venv/bin/activate
if [ $(node --version) != "v10.16.0" ]; then
	>&2 echo "wrong node version $(node --version)"
	deactivate
	if [[ "$_" == "$0" ]]; then
		popd
		exit 1
	fi
else
	if [ ! -d node_modules ]; then
		npm install
	fi
fi
alias truffle=$d/node_modules/truffle/build/cli.bundled.js
popd
