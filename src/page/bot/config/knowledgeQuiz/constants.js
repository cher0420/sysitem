export const tableData={
  all:[
    {id:1, index:0,name:'residentialPass',title:'居住证_办理_查询办理流程', status:{weChat: true,web: true,desktop: true, robot: true}},
    {id:2, index:1,name:'residentialPass',title:'居住证_办理_查询办理条件', status:{weChat: true,web: true,desktop: true, robot: true}},
    {id:3,index:2,name:'residentialPass',title:'居住证_办理_查询所需材料',status:{weChat: true,web: false,desktop: true, robot: true}},
    {id:4, index:0,name:'socialSecurityCards',title:'社保卡_办理_查询办理流程', status:{weChat: true,web: true,desktop: true, robot: true}},
    {id:5, index:1,name:'socialSecurityCards',title:'社保卡_办理_查询办理条件', status:{weChat: true,web: true,desktop: true, robot: true}},
    {id:6,index:2,name:'socialSecurityCards',title:'社保卡_办理_查询所需材料',status:{weChat: true,web: false,desktop: true, robot: true}},
    {id:7,index:0, name:'separation',title:'人户分离_受理_查询办理条件', status:{weChat: true,web: true,desktop: true, robot: true}},
    {id:8, index:1,name:'separation',title:'人户分离_受理_查询所需材料', status:{weChat: true,web: true,desktop: true, robot: true}},
    {id:9,index:2,name:'separation',title:'人户分离_受理_查询办理流程',status:{weChat: true,web: false,desktop: true, robot: true}},
  ],
  residentialPass:[
    {id:1, index:0, name:'residentialPass',title:'居住证_办理_查询办理流程', status:{weChat: true,web: true,desktop: true, robot: true}
    },
    {id:2, index:1, name:'residentialPass',title:'居住证_办理_查询办理条件', status:{weChat: true,web: true,desktop: true, robot: true}},
    {id:3,index:2, name:'residentialPass',title:'居住证_办理_查询所需材料',status:{weChat: true,web: false,desktop: true, robot: true}},
  ],
  socialSecurityCards:[
    {id:1, index:0, name:'socialSecurityCards',title:'社保卡_办理_查询办理流程', status:{weChat: true,web: true,desktop: true, robot: true}},
    {id:2, index:1, name:'socialSecurityCards',title:'社保卡_办理_查询办理条件', status:{weChat: true,web: true,desktop: true, robot: true}},
    {id:3, index:2, name:'socialSecurityCards',title:'社保卡_办理_查询所需材料',status:{weChat: true,web: false,desktop: true, robot: true}},
  ],
  separation:[
    {id:1, index:0, name:'separation',title:'人户分离_受理_查询办理条件', status:{weChat: true,web: true,desktop: true, robot: true}},
    {id:2, index:1, name:'separation',title:'人户分离_受理_查询所需材料', status:{weChat: true,web: true,desktop: true, robot: true}},
    {id:3, index:2, name:'separation',title:'人户分离_受理_查询办理流程',status:{weChat: true,web: false,desktop: true, robot: true}},
  ]
}
export const detail={
  residentialPass:[
    '【本事项可“全市通办”】\n' +
    '1、申请人本人到街道（乡镇）社区事务受理服务中心提交相关申办材料。\n' +
    '2、街道（乡镇）社区事务受理服务中心指导申请人填写《上海市居住证申请表》并确认签字，核对材料。\n' +
    '3、对材料不齐全的，应当告知申请人需要补齐的内容，并将申请材料退还申请人。\n' +
    '4、对材料齐全的，应当在居住证信息系统中登记信息、拍照，并出具《上海市居住证受理回执》。\n' +
    '5、凭个人有效居民身份证原件和《上海市居住证受理回执》领取证件。\n',
    '境内来沪人员在本市办理居住登记满半年，且符合有合法稳定就业、合法稳定住所、连续就读条件之一。',
    '1、申请人本人有效居民身份证正、反面复印件或户口簿复印件（验原件）；\n' +
    '2、《上海市居住证申请表》；\n' +
    '3、申请人现居住地址与居住登记地址不一致的，应当提供相应的在沪合法居住证明：居住在本人或近亲属自购住房的，提供相应的房地产权证明复印件（验原件）；居住在本人或近亲属租赁住房的，提供房屋管理部门出具的房屋租赁合同登记备案证明复印件（验原件）；居住在单位、学校集体宿舍的，提供单位、学校人事或者保卫部门出具的集体宿舍证明；\n' +
    '4、居住在近亲属自购或者租赁住房的，还应当提供相应的亲属关系证明。'
  ],
  separation:[
    '本市户籍人员中户籍地与居住地不一致的人户分离人员。',
    '1、本人居民身份证，《居民户口簿》或加盖单位人事、保卫部门印章的《集体户口个人信息页》复印件等有效身份证明；\n' +
    '2、《本市户籍人户分离人员居住登记申请表》；\n' +
    '3、居住房屋产权证明、租用公房凭证或由房屋行政管理部门出具的房屋租赁登记备案证明。\n',
    '【本事项可“全市通办”】\n' +
    '1、申请人向社区事务受理服务中心提出申请并提供相关材料；\n' +
    '2、经社区事务受理服务中心审核，对符合办理要求的，打印《本市户籍人户分离人员居住登记申请（回执）》。'
  ],
  socialSecurityCards:[
    '【本事项可“全市通办”】\n' +
    '申请人到社保卡网点（大部分设置在社区事务受理服务中心内，具体可拨打962222热线或在www.962222.net网站上查询）提出申请；社保卡网点对材料进行审核；符合条件的，采集申请人信息。',
    '具有本市常住户口的人员：\n' +
    '0-6周岁，申领社保卡儿童卡；\n' +
    '7-69周岁，申领社保卡蓝卡；\n' +
    '70周岁以上，申领社保卡红卡；\n' +
    '本市离休干部，申领社保卡金卡；',
    '申请人本人有效居民身份证原件、户口簿（未满16周岁的，可以不提供有效居民身份证原件）。'
  ]
}


