# Bash 'Strict Mode'
# http://redsymbol.net/articles/unofficial-bash-strict-mode
# https://github.com/xwmx/bash-boilerplate#bash-strict-mode
set -o nounset
set -o errexit
set -o pipefail
IFS=$'\n\t'

sh <(curl -L https://nixos.org/nix/install) --no-daemon
wget https://github.com/scrtlabs/SecretNetwork/releases/latest/download/secretcli-Linux
chmod +x secretcli-Linux
sudo mv secretcli-Linux /usr/local/bin/secretcli
. ~/.nix-profile/etc/profile.d/nix.sh
nix-shell
rustup default stable
rustup target add wasm32-unknown-unknown
rustup install nightly
rustup target add wasm32-unknown-unknown --toolchain nightly