const quota_table = {
  quota: {
    title: '할당량',
    tenant_limit: '테넌트 제한',
    base_price: '기본 가격',
    mau_limit: 'MAU 제한',
  },
  application: {
    title: '애플리케이션',
    total: '총 애플리케이션 수',
    m2m: '머신 투 머신',
  },
  resource: {
    title: 'API 리소스',
    resource_count: '리소스 수',
    scopes_per_resource: '리소스 당 권한',
  },
  branding: {
    title: 'UI 및 브랜딩',
    custom_domain: '사용자 정의 도메인',
    custom_css: '사용자 정의 CSS',
    app_logo_and_favicon: '앱 로고와 파비콘',
    dark_mode: '다크 모드',
    i18n: '국제화',
  },
  user_authn: {
    title: '사용자 인증',
    omni_sign_in: '옴니 사인인',
    password: '비밀번호',
    passwordless: '비밀번호 없음 - 이메일과 SMS',
    email_connector: '이메일 커넥터',
    sms_connector: 'SMS 커넥터',
    social_connectors: '소셜 커넥터',
    standard_connectors: '표준 커넥터',
    built_in_email_connector: '내장 이메일 커넥터',
    mfa: 'MFA',
    sso: '기업 SSO',
  },
  user_management: {
    title: '사용자 관리',
    user_management: '사용자 관리',
    roles: '역할',
    machine_to_machine_roles: '머신 투 머신 역할',
    scopes_per_role: '역할 당 권한',
  },
  audit_logs: {
    title: '감사 로그',
    retention: '보존 기간',
  },
  hooks: {
    title: 'Webhooks',
    hooks: 'Webhooks',
  },
  organizations: {
    title: '조직',
    organizations: '조직',
    monthly_active_organization: '월간 활성 조직',
    allowed_users_per_org: '조직 당 허용된 사용자',
    invitation: '초대장 (곧 제공 예정)',
    org_roles: '조직 역할',
    org_permissions: '조직 권한',
    just_in_time_provisioning: '적시 프로비저닝',
  },
  support: {
    /** UNTRANSLATED */
    title: 'Compliance and support',
    community: '커뮤니티',
    customer_ticket: '지원 티켓',
    premium: '프리미엄',
    /** UNTRANSLATED */
    email_ticket_support: 'Email ticket support',
    /** UNTRANSLATED */
    soc2_report: 'SOC2 report (Coming soon)',
    /** UNTRANSLATED */
    hipaa_or_baa_report: 'HIPAA/BAA report (Coming soon)',
  },
  unlimited: '무제한',
  contact: '문의',
  monthly_price: '${{value, number}}/월',
  days_one: '{{count, number}} 일',
  days_other: '{{count, number}} 일',
  add_on: '부가 기능',
  tier: '레벨{{value, number}}: ',
  free_token_limit_tip: '무료 {{value}}M 토큰 발급',
  paid_token_limit_tip:
    '무료 {{value}}M 토큰 발급. 가격 확정 후 {{value}}M 토큰을 초과하면 추가 요금이 부과될 수 있습니다.',
  paid_quota_limit_tip:
    '가격 확정 후 할당량 제한을 초과하는 기능에 대해 부가 기능으로 요금이 부과될 수 있습니다.',
  beta_feature_tip: '베타 단계에서 무료입니다. 부가 기능 가격 확정 후 요금이 부과됩니다.',
  usage_based_beta_feature_tip:
    '베타 단계에서 무료입니다. 조직 사용량 기반 요금 책정 후 요금이 부과됩니다.',
  beta: '베타',
  add_on_beta: '부가 기능 (베타)',
};

export default Object.freeze(quota_table);
