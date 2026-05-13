import tls from 'tls';
function translateTLS(protocol: string) {
  switch (protocol) {
    case 'TLSv1':
      return {
        status: 'Critically Outdated',
        message:
          'Your site uses TLS 1.0, retired in 2020. Attackers can intercept data sent through your site. This needs fixing immediately.',
        urgency: 'critical',
      };

    case 'TLSv1.1':
      return {
        status: 'Outdated',
        message:
          'Your site uses TLS 1.1, retired in 2020. Modern browsers are beginning to block sites running this version.',
        urgency: 'critical',
      };
    case 'TLSv1.2':
      return {
        status: 'Acceptable',
        message:
          'Your site uses TLS 1.2. It meets minimum security standards but upgrading to TLS 1.3 would be stronger and faster.',
        urgency: 'warning',
      };
    case 'TLSv1.3':
      return {
        status: 'Secure',
        message:
          'Your site uses TLS 1.3, which is the latest and most secure version of TLS.',
        urgency: 'low',
      };
    default:
      return {
        status: '⚠️ Unknown',
        message: `Your site returned an unrecognised protocol version: ${protocol}`,
        urgency: 'warning',
      };
  }
}

function isSecure(protocol: string, authorized: boolean, daysLeft: number) {
  const modernTLS = ['TLSv1.2', 'TLSv1.3'].includes(protocol);
  const expired = daysLeft <= 0;
  const expiringSoon = daysLeft > 0 && daysLeft < 30;

  // Fully secure
  if (
    authorized &&
    modernTLS &&
    !expired &&
    !expiringSoon &&
    protocol === 'TLSv1.3'
  )
    return {
      status: 'secure',
      message:
        'Your website is fully secured with the latest encryption standard',
    };

  // Acceptable but not best
  if (authorized && protocol === 'TLSv1.2' && !expired && !expiringSoon)
    return {
      status: 'acceptable',
      message:
        'Your website is secure but not running the latest encryption standard',
    };

  // Expiring soon
  if (authorized && modernTLS && expiringSoon)
    return {
      status: 'warning',
      message: `Your website is secure but your certificate expires in ${daysLeft} days`,
    };

  // Not trusted
  if (!authorized && modernTLS && !expired)
    return {
      status: 'warning',
      message: 'Your certificate exists but is not trusted by all browsers',
    };

  // Expired
  if (expired)
    return {
      status: 'critical',
      message:
        'Your certificate has expired. Visitors are seeing a security warning',
    };

  // Old TLS
  if (!modernTLS)
    return {
      status: 'critical',
      message:
        'Your website is running outdated encryption that was retired in 2020',
    };

  // Catch all
  return {
    status: 'critical',
    message: 'Your website has a security issue',
  };
}

export default async function checkSSL(host: string) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect({ port: 443, host, servername: host }, () => {
      const cert = socket.getPeerCertificate(true);
      const protocol = socket.getProtocol();
      const protocolStatus = translateTLS(protocol as string);
      const sans = cert.subjectaltname
        ?.split(', ')
        .map((s) => s.replace('DNS:', ''));
      const coversWWW = sans?.some(
        (s) => s === `www.${host}` || s === `*.${host}`,
      );
      console.log(coversWWW);
      const coversRoot = sans?.some((s) => s === host);

      const expiryDate = new Date(cert.valid_to);
      const daysLeft = Math.ceil(
        (expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
      );

      resolve({
        expiryDate: cert.valid_to,
        protocolStatus,
        issueDate: cert.valid_from,
        daysLeft: `Your security expires in ${daysLeft} days`,
        coversRoot,
        coversWWW,
        expired: daysLeft < 0,
        expiringSoon: daysLeft < 30,

        //protcol
        protocol: socket.getProtocol(),
        cipher: socket.getCipher(),
        secure: isSecure(protocol as string, socket.authorized, daysLeft),
        //trust

        trusted: socket.authorized
          ? `Your certificate is trusted by all browsers - verfied by ${cert.issuer.O || cert.issuer.CN}`
          : `Your certificate is not trusted by all browsers - verfied by ${cert.issuer.O || cert.issuer.CN}`,
        authError: socket.authorizationError,

        //strength

        keyStrength: cert.bits,

        // Fingerprint
        fingerprint: cert.fingerprint256,

        // Serial
        serialNumber: cert.serialNumber,
      });
      socket.end();
    });
    socket.on('error', (err) => {
      reject(err);
    });
  });
}
