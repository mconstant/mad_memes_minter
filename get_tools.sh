# Bash 'Strict Mode'
# http://redsymbol.net/articles/unofficial-bash-strict-mode
# https://github.com/xwmx/bash-boilerplate#bash-strict-mode
set -o nounset
set -o errexit
set -o pipefail
IFS=$'\n\t'

wget https://github.com/scrtlabs/SecretNetwork/releases/latest/download/secretcli-Linux
chmod +x secretcli-Linux
sudo mv secretcli-Linux /usr/local/bin/secretcli