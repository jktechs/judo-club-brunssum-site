import { getInitPage } from '@keystone-6/auth/pages/InitPage';

const fieldPaths = ["name","email","password","admin"];

export default getInitPage({"listKey":"User","fieldPaths":["name","email","password","admin"],"enableWelcome":false});
