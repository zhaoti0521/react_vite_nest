export interface TreeNode {
  label: string;
  name: string;
  child: TreeNode[] | [];
}
export interface TreeNode1 {
  title: string;
  name: string;
  child: TreeNode1[] | [];
}
export const tree: TreeNode[] = [
  {
    label: "zhaoti",
    name: "name",
    id: 1,
    child: [
      {
        label: "zhaoti-child1",
        name: "name1",
        child: [
          {
            label: "zhaoti-child2",
            name: "name2",
            child: [
              {
                label: "zhaoti-child3",
                name: "name3",
                child: [],
              },
            ],
          },
        ],
      },
    ],
  },
];
