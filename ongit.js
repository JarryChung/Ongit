#!/usr/bin/env node

const childProcess = require('child_process');
const os = require('os');

const getPath = () => {
  return process.argv[2] || '.';
};

const getGitURL = (gitPath) => {
  let url = '';
  try {
    url = childProcess.execSync(`git -C ${gitPath} remote -v`).toString();
    if (!url) {
      console.log('[ongit] This git project does not have a origin address set');
      process.exit(-2);
    }
  } catch (error) {
    console.log('[ongit] This folder does not appear to be a git project');
    process.exit(-1);
  }
  return url;
};

const getTarget = (gitUrl) => {
  const line1 = gitUrl.split('\n')[0];
  if (!line1) {
    console.log('[ongit] An error occurred while getting the origin address');
    process.exit(-3);
  }
  let target = line1.split('.git')[0];
  if (target.indexOf('git@') >= 0) {
    target = `https://${target.split('git@')[1].replace(':', '/')}`;
  } else {
    target = target.split('\t')[1];
  }
  return target;
};

const getCommand = () => {
  const COMMAND_MAP = {
    darwin: 'open',
    win32: 'start',
    default: 'xdg-open',
  };
  const platform = os.platform();
  return COMMAND_MAP[platform] || platform.default;
};

const gitPath = getPath();
const url = getGitURL(gitPath);
const target = getTarget(url);
const command = getCommand();
childProcess.execSync(`${command} ${target}`);
