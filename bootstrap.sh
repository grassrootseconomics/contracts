#!/bin/bash

pyver='3.7.3'
pydir="Python-${pyver}"
#pysrc="https://www.python.org/ftp/python/${pyver}/${pydir}.tgz"
pysrc="/home/lash/Downloads/${pydir}.tgz"
web3pyver='4.9.2'
nodever='10.6.0'
nodeverexisting=$(node --version)

if [ $nodeverexisting != "v${nodever}" ]; then
	>&2 echo "node version mismatch, need v${nodever}, have $nodeverexisting"
	exit 1
fi

venv=`which virtualenv`
if [ $?  -gt 0 ]; then
	>&2 echo "virtualenv missing"
	exit 1
fi

tmp=`mktemp -d`
pushd $tmp
#wget $pysrc
cp $pysrc .
tar -zxvf ${pydir}.tgz
ls
pushd ${pydir}
pysrcdir=`pwd`
echo diiiiir $pysrcdir
ls
./configure --prefix=/usr
make
make install DESTDIR=${pysrcdir}/build
popd
popd
virtualenv -p "${pysrcdir}/build/usr/bin/python3.7" .venv
. .venv/bin/activate
pip install -v https://files.pythonhosted.org/packages/24/f5/3d6e3ac1ec98dc736084a8f821b922517d5492714889bf29460d9d97bda0/web3-${web3pyver}-py3-none-any.whl
deactivate
