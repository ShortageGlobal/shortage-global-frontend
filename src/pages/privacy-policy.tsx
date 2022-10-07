import styles from 'styles/pages/privacy-policy.module.scss';
import { useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Head from 'next/head';
import {
  Breadcrumbs,
  getHomeCrumb,
  getPrivacyPolicyCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import type { NextPageWithLayout } from 'pages/_app';

const PrivacyPolicy: NextPageWithLayout = () => {
  const breadcrumbs = useMemo(() => {
    return [getHomeCrumb(), getPrivacyPolicyCrumb({ isActive: true })];
  }, []);

  return (
    <>
      <Head>
        <title>Privacy Policy | Shortage</title>
      </Head>

      <Container>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>
      </Container>

      <Container>
        <Row>
          <Col className={styles.privacyPolicy}>
            <header>
              <h2 className={styles.header}>Shortage Privacy Policy</h2>
              <p className={styles.effectiveFrom}>Effective October 06, 2022</p>
            </header>
            <p>
              By clicking “I Accept,” or using this website, you acknowledge
              that you have READ, UNDERSTOOD, AND AGREED to this Privacy Policy
              and the Terms of Service.
            </p>
            <h4 className={styles.sectionHeader}>1. General</h4>
            <p>
              This Privacy Policy explains the information collection, use, and
              sharing practices of Shortage Global, Inc. (“we,” “us,” and “our”)
              in connection with the use of Shortage.Global (“Platform”) by you
              (“you,” “your,” and “User”).
            </p>
            <p>
              IF YOU DO NOT AGREE TO THIS PRIVACY POLICY, PLEASE DO NOT USE THE
              PLATFORM.
            </p>
            <p>
              The Platform is intended for users over the age of 18. Please do
              not use or otherwise access the Platform if you are not 18.
            </p>
            <p>
              Before you use or submit any information through or in connection
              with the Platform, please carefully review this Privacy Policy. By
              using any part of the Platform, you understand that your
              information will be collected, used, and disclosed as outlined in
              this Privacy Policy.
            </p>
            <h4 className={styles.sectionHeader}>
              2. Revisions of Privacy Policy and Terms of Service
            </h4>
            <p>
              We may revise this Privacy Policy and the Terms of Service at any
              time and for any reason. We will post the revised Privacy Policy
              and Terms of Service on the Platform. By clicking “I Accept” or
              using the Platform after the effective date of the revisions you
              agree to the revised Privacy Policy and Terms of Service.
            </p>
            <h4 className={styles.sectionHeader}>3. Information We Collect</h4>
            <p>
              We collect information in multiple ways, including when you
              provide information directly to us, when we passively collect
              information from you, such as from your browser or electronic
              device, and from third parties.
            </p>
            <p>
              Information You Provide Directly to Us. We may collect any
              information you provide to us. This information may include your
              name, e-mail address, phone number, address, anything included in
              the video and audio recording, information needed for the
              electronic record of online notarizations as detailed in the Terms
              of Service, notary&apos;s photo, notary commission information,
              geographic location, and your social media handles. No credit card
              information is stored on the Platform after the end of the online
              notarization session. An electronic document that is not notarized
              on the Platform on the day it is uploaded is automatically deleted
              from the Platform at the end of the day. A notarized electronic
              document is automatically deleted from the Platform after 7 days
              from the day of online notarization. If you take the identity
              proofing quiz, the Platform does not store your answers after the
              quiz is completed.
            </p>
            <p>
              Information Collected Automatically: Device/Usage Information. We
              may collect certain information about the electronic devices you
              use to access the Platform. As described further below, we may
              collect and analyze (i) device information such as IP addresses,
              location information (by country and city), unique device
              identifiers, IMEI and TCP/IP address, browser types, browser
              language, operating system, mobile device carrier information, and
              (ii) information related to the ways in which you interact with
              the Platform, such as referring and exit web pages and URLs, the
              number of clicks, domain names, landing pages, pages and content
              viewed and the order of those pages, statistical information about
              the use of the Platform, the amount of time spent on particular
              pages, the date and time you used the Platform, the frequency of
              your use of the Platform, error logs, and other similar
              information. As described further below, we may use third-party
              analytics providers and technologies, including cookies and
              similar tools, to assist in collecting this information.
            </p>
            <p>
              Information Collected Automatically: Cookies and Other Tracking
              Technologies. We may also collect data about your use of the
              Platform through the use of Internet server logs and online
              tracking technologies, like cookies and/or tracking pixels. A web
              server log is a file where website activity is stored. A cookie is
              a small text file that is placed on your electronic device when
              you visit a website, that enables us to: (i) recognize your
              device; (ii) store your preferences and settings; (iii) understand
              the web pages of the Platform you have visited and the referral
              sites that have led you to the Platform; (iv) enhance your user
              experience by delivering content specific to your inferred
              interests; (v) perform searches and analytics; and (vi) assist
              with security administrative functions. Tracking pixels (sometimes
              referred to as web beacons or clear GIFs) are tiny electronic tags
              with a unique identifier embedded in websites, online ads and/or
              e-mail, and that are designed to provide usage information like ad
              impressions or clicks, measure popularity of the Platform and any
              associated advertising, and to access user cookies. We may also
              use tracking technologies in our license buttons and/or icons that
              you can embed on other sites/services to track the website
              addresses where they are embedded, gauge user interaction with
              them, and determine the number of unique viewers of them. If you
              receive e-mail from us (such as our newsletter, updates, or other
              ongoing e-mail communications) we may use certain analytics tools,
              such as clear GIFs, to capture data such as whether you open our
              message, click on any links or banners our e-mail contains, or
              otherwise interact with what we send. This data allows us to gauge
              the effectiveness of our communications. As we adopt additional
              technologies, we may also gather additional information through
              other methods. You can change your settings to notify you when a
              cookie is being set or updated, or to block cookies altogether.
              Please consult the “Help” section of your browser for more
              information. Please note that by blocking any or all cookies, you
              may not have access to certain features of the Platform.
            </p>
            <p>
              Information Collected from Third Parties. To the extent permitted
              by law, we may collect information about you from third parties,
              including public sources, social media platforms, and marketing
              and market research firms.
            </p>
            <h4 className={styles.sectionHeader}>
              4. How We Use Your Information
            </h4>
            <p>
              We may use the information we collect from and about you to: (i)
              fulfill the purposes for which you provided it; (ii) provide and
              improve the Platform, including to develop new features, take
              steps to secure the Platform, and for technical and customer
              support; (iii) send you information about your relationship or
              transactions with us, account alerts, or other communications;
              (iv) process and respond to your inquiries or to request your
              feedback; (v) conduct analytics, research, and reporting,
              including to synthesize and derive insights from your use of the
              Platform; and (vi) comply with the law and protect the safety,
              rights, property, or security of Shortage Global, Inc., the
              Platform, our users, and the general public.
            </p>
            <p>
              We may combine information that we collect from you and about you
              (including automatically collected information) with information
              we obtain about you from third parties, and use such combined
              information in accordance with this Privacy Policy.
            </p>
            <p>
              We may aggregate and/or de-identify information collected through
              the Platform. We may use de-identified and/or aggregated data for
              any purpose, including for research and marketing purposes.
            </p>
            <h4 className={styles.sectionHeader}>
              5. When We or Shortage May Disclose Your Information
            </h4>
            <p>
              Service Providers. We may disclose your information to third
              parties who perform services for us, including credit card
              processing, identity verification, credential analysis, event
              management, marketing, customer support, data storage, data
              analysis and processing, and legal services.
            </p>
            <p>
              Disclosure by Florida Shortage. A Florida Shortage, upon request
              and payment of the fees allowed by the applicable law, must make
              electronic copies of the pertinent entries in the electronic
              record of online notarizations and provide access to the related
              audio-video communication recordings to the following persons: (a)
              the parties to an electronic document notarized by the Shortage;
              (b) the qualified custodian of an electronic will notarized by the
              Shortage; (c) the title agent, settlement agent, or title insurer
              who insured the electronic record or engaged the Shortage with
              regard to a real estate transaction; (d) the Shortage&apos;s
              remote online notarization service provider whose services were
              used to notarize the electronic document; (e) any person who is
              asked to accept a power of attorney that was notarized by the
              Shortage; (f) the Florida Department of State pursuant to a notary
              misconduct investigation; and (g) any other persons pursuant to a
              subpoena, court order, law enforcement investigation, or other
              lawful inspection demand.
            </p>
            <p>
              Disclosure by Minnesota Shortage. A Minnesota notary public and
              the notary public&apos;s agent must make a copy of the
              individual&apos;s data included in the electronic record of online
              notarizations available only to the individual whose signature was
              notarized or to a guardian, conservator, attorney-in-fact, or
              personal representative of an incapacitated or deceased
              individual. The individual whose signature was notarized or the
              individual&apos;s guardian, conservator, attorney-in-fact, or
              personal representative of an incapacitated or deceased individual
              may consent to the release of the data to a third party.
            </p>
            <p>
              Disclosure by Tennessee Shortage. The electronic record kept of a
              Tennessee notary public&apos;s official acts is a public record.
              Such information is available for public inspection, unless it is
              a confidential record according to law. The Shortage can provide a
              paper or electronic copy of the information when needed or when
              requested by a member of the public.
            </p>
            <p>
              Disclosure by Texas Shortage. Records regarding Texas notarial
              acts performed are public information. On payment of all fees, a
              Texas notary public is required to promptly provide a certified
              copy of any entries in the notary public&apos;s records to any
              person requesting the copy. If any portion of the audio visual
              recording of an online notarization includes biometric information
              or includes an image of the identification card used to identify
              the signer, that portion of the recording is confidential and
              shall not be released without consent of the individual whose
              identity is being established, unless ordered by a court of
              competent jurisdiction or upon request by the Texas secretary of
              state.
            </p>
            <p>
              Disclosure by Virginia Shortage. A Virginia Shortage must respond
              to a lawful, written request to inspect the Shortage&apos;s
              electronic record of online notarizations by producing a certified
              copy of the electronic record that includes an entry documenting
              the certified copy production.
            </p>
            <p>
              Legal Compliance and Protection. We may disclose your information
              if required to do so by law or in a good faith belief that such
              disclosure is permitted by this Privacy Policy or reasonably
              necessary or appropriate for any of the following reasons: (i) to
              comply with legal process; (ii) to enforce or apply this Privacy
              Policy, the Terms of Service, or other contracts with you,
              including investigation of potential violations thereof; (iii) to
              respond to your requests for customer service; and/or (iv) to
              protect the rights, property, or personal safety of Shortage
              Global, Inc., our agents and affiliates, our users, and the
              public. This includes exchanging information with other
              organizations for fraud protection, spam/malware prevention, and
              similar purposes.
            </p>
            <p>
              Business Transfers. As we continue to develop our business, we may
              engage in certain business transactions, such as the transfer or
              sale of our assets. In such transactions, (including in
              contemplation of such transactions, e.g., due diligence) your
              information may be disclosed. If any of our assets are sold or
              transferred to a third party, user information (including your
              e-mail address) would likely be one of the transferred business
              assets.
            </p>
            <p>
              Affiliated Companies. We may disclose your information with
              current or future affiliated companies.
            </p>
            <p>
              Consent. We may disclose your information to any third parties
              based on your consent to do so.
            </p>
            <p>
              Aggregate/De-identified Information. We may disclose de-identified
              and/or aggregated data for any purpose to third parties, including
              advertisers, promotional partners, and/or others.
            </p>
            <h4 className={styles.sectionHeader}>
              6. Legal Basis for Processing Personal Data
            </h4>
            <p>
              The laws in some jurisdictions require companies to tell you about
              the legal ground they rely on to use or disclose information that
              can be directly linked to or used to identify you. To the extent
              those laws apply, our legal grounds for processing such
              information are as follows:
            </p>
            <p>
              Our Contractual Commitments to You. Much of our processing of
              information is to meet our contractual obligations to provide
              services to our users.
            </p>
            <p>
              Legitimate Interests. In many cases, we handle information on the
              ground that it furthers our legitimate interests in ways that are
              not overridden by the interests or fundamental rights and freedoms
              of the affected individuals, these include: (i) customer service;
              (ii) marketing, advertising, and fundraising; (iii) protecting our
              users, personnel, and property; (iv) managing user accounts; (v)
              organizing and running events and programs; (vi) analyzing and
              improving our business; and (vii) managing legal issues. We may
              also process information for the same legitimate interests of our
              users and business partners.
            </p>
            Legal Compliance. We may need to use and disclose information in
            certain ways to comply with our legal obligations.
            <p>
              Consent. Where required by law, and in some other cases where
              legally permissible, we handle information on the basis of
              consent. Where we handle your information on the basis of consent,
              you have the right to withdraw your consent, in accordance with
              applicable law.
            </p>
            <h4 className={styles.sectionHeader}>7. Online Analytics</h4>
            <p>
              We may use third-party web analytics services (such as Google
              Analytics) on our Platform to collect and analyze the information
              discussed above, and to engage in auditing, research, or
              reporting. The information (including your IP address) collected
              by various analytics technologies described in the Cookies and
              Other Tracking Technologies provision above will be disclosed to
              or collected directly by these service providers, who use the
              information to evaluate your use of the Platform, including by
              noting the third-party website from which you arrive to the
              Platform, analyzing usage trends, assisting with fraud prevention,
              and providing certain features to you. To prevent Google Analytics
              from using your information for analytics, you may install the
              Google Analytics Opt-out Browser Add-on.
            </p>
            <h4 className={styles.sectionHeader}>
              8. Your Choices and Data Subject Rights
            </h4>
            <p>
              You have various rights with respect to the collection and use of
              your information through the Platform. Those choices are as
              follows:
            </p>
            <p>
              E-mail Unsubscribe. You may unsubscribe from our marketing e-mails
              at any time by e-mailing us with your request at
              support@shortage.global.
            </p>
            <p>
              EU Data Subject Rights. Individuals in the European Economic Area
              and other jurisdictions have certain legal rights (subject to
              applicable exceptions and limitations) to obtain confirmation of
              whether we hold certain information about them, to access such
              information, and to obtain its correction or deletion in
              appropriate circumstances. You may have the right to object to our
              handling of your information, restrict our processing of your
              information, and to withdraw any consent you have provided. To
              exercise these rights, please e-mail us with the nature of your
              request at support@shortage.global. You also have the right to go
              directly to the relevant supervisory or legal authority, but we
              encourage you to contact us so that we may resolve your concerns
              directly as best and as promptly as we can.
            </p>
            <h4 className={styles.sectionHeader}>9. International Transfers</h4>
            <p>
              Some of your information may be processed outside the United
              States. By providing us with your information, you acknowledge any
              such transfer, storage or use.
            </p>
            <h4 className={styles.sectionHeader}>10. Security Measures</h4>
            <p>
              We have implemented technical, physical, and organizational
              security measures to protect against the loss, misuse, and/or
              alteration of your information. These safeguards vary based on the
              sensitivity of the information that we collect and store. However,
              we cannot and do not guarantee that these measures will prevent
              every unauthorized attempt to access, use, or disclose your
              information since despite our efforts, no Internet and/or other
              electronic transmission can be completely secure.
            </p>
            <h4 className={styles.sectionHeader}>11. Data Retention</h4>
            <p>
              We retain the information we collect for as long as necessary to
              fulfill the purposes set forth in this Privacy Policy and the
              Terms of Service, or as long as we are legally required or
              permitted to do so. Information may persist in copies made for
              backup and business continuity purposes for additional time.
            </p>
            <h4 className={styles.sectionHeader}>
              12. Third-Party Links and Platform
            </h4>
            <p>
              The Platform may contain links to third-party websites,
              third-party plug-ins, and other services. If you choose to use
              these sites or features, you may disclose your information not
              just to those third parties, but also to their users and the
              public more generally depending on how their services function. We
              are not responsible for the content or privacy practices of such
              third party websites or services. The collection, use and
              disclosure of your information will be subject to the privacy
              policies of the third party websites or services, and not this
              Privacy Policy. We encourage you to read the privacy statements of
              each and every site you visit.
            </p>
            <h4 className={styles.sectionHeader}>
              13. Questions about this Privacy Policy
            </h4>
            <p>
              If you have any questions about this Privacy Policy, you can
              e-mail us with your question at support@shortage.global.
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PrivacyPolicy;
