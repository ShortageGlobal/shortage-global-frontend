import styles from 'styles/pages/privacy-policy.module.scss';
import { useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
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
              <h2 className={styles.header}>Privacy Policy</h2>
              <p className={styles.effectiveFrom}>Effective June 19, 2022</p>
            </header>
            <p>
              <Link href="/">
                <a>Shortage</a>
              </Link>{' '}
              places a high priority on protecting your privacy. This Privacy
              Policy was created in order to demonstrate Shortage&apos;s
              commitment to the privacy of our members and website users. This
              Privacy Policy applies to{' '}
              <Link href="/">
                <a>shortage.global</a>
              </Link>{' '}
              and to our social media profiles, and governs data collection,
              usage, and sharing. The Shortage website is an informational and
              ecommerce website. By using the Shortage website, you consent to
              the data practices described in this document.
            </p>
            <p>
              This Policy explains what types of information are collected by
              Shortage&apos;s website,{' '}
              <Link href="/">
                <a>shortage.global</a>
              </Link>
              , and how this information is used.
            </p>
            <h4 className={styles.sectionHeader}>
              Collection of your Personal Information
            </h4>
            <p>
              “Personal Information” is information that can be used to identify
              you as an individual or allow someone to contact you, as well as
              information attributed with such information. We collect different
              categories of Personal Information from different sources,
              including User-Provided Information and Automatically Collected
              Information. We also collect Personal Information from social
              networking platforms, which may provide both User-Provided
              Information and Automatically Collected Information. For more on
              social networking platforms, see the Social Networking section,
              below. This privacy policy applies to all personal information,
              whether collected online or offline.
            </p>
            <h4 className={styles.sectionHeader}>User-Provided Information</h4>
            <p>
              In order to better provide you with products and services offered
              on our website, Shortage may collect personally identifiable
              information, such as your:
            </p>
            <ul>
              <li>Company/organization name</li>
              <li>First and last name</li>
              <li>Mailing address</li>
              <li>Shipping address</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Photograph(s)</li>
            </ul>
            <p>No credit card information is stored on the Shortage website.</p>
            <p>
              We do not collect any Personal Information from you unless you
              voluntarily provide it to us. However, you may be required to
              provide certain Personal Information to us when you elect to use
              certain features or services available on the website. These may
              include: (a) registering for an account on our website; (b)
              sending us an email message; (c) submitting your credit card or
              other payment information when ordering products and services on
              our website; (d) signing up for email newsletters and other
              communications; (e) completing surveys; (f) posting a comment or
              otherwise contributing to a social forum on the web site. We will
              use your information for, but not limited to, communicating with
              you in relation to services and/or products you have requested
              from us. We also may gather additional personal or non-Personal
              Information in the future.
            </p>
            <h4 className={styles.sectionHeader}>
              Automatically Collected Information
            </h4>
            <p>
              As is the case with many websites, Information about your computer
              hardware and software may be automatically collected by Shortage.
              This information can include: your IP address, browser types,
              domain names, access times and referring website addresses. This
              information is used for the operation of the service, to maintain
              quality of the service, and to provide general statistics
              regarding use of the Shortage website. In order to improve our
              Services, we may receive a notification when you open an email
              from Shortage or click on a link therein.
            </p>
            <p>
              Among other things, this information enables us to generate
              analytics reports on the usage of our website. To opt-out of your
              website usage being included in our Google Analytics reports, you
              may follow the instructions at{' '}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noreferrer"
              >
                https://tools.google.com/dlpage/gaoptout
              </a>
              .
            </p>
            <h4 className={styles.sectionHeader}>Use of Cookies</h4>
            <p>
              The Shortage website may use “cookies” to help you personalize
              your online experience. A cookie is a text file that is placed on
              your hard disk by a web server. Cookies cannot be used to run
              programs or deliver viruses to your computer. Cookies are uniquely
              assigned to you, and can only be read by a web server in the
              domain that issued the cookie to you.
            </p>
            <p>
              One of the primary purposes of cookies is to provide a convenience
              feature to save you time. The purpose of a cookie is to tell the
              web server that you have returned to a specific page. For example,
              if you register with the Shortage website or services, a cookie
              helps Shortage to recall your specific information on subsequent
              visits. This simplifies the process of recording your Personal
              Information, such as billing addresses, shipping addresses and so
              on. When you return to the Shortage website, the information you
              previously provided can be retrieved, so you can easily use the
              features of the website.
            </p>
            <p>
              You have the ability to accept or decline cookies. Most web
              browsers automatically accept cookies, but you can usually modify
              your browser settings to decline cookies if you prefer. If you
              choose to decline cookies, you may not be able to fully experience
              the interactive features of the Shortage website.
            </p>
            <h4 className={styles.sectionHeader}>Social Networking</h4>
            <p>
              We maintain a presence on several social networking and blogging
              platforms which are operated by third parties, such as Facebook,
              Twitter, Instagram, LinkedIn, YouTube and Reddit. Through these
              platforms and features, we receive some Personal Information about
              you, and this Privacy Policy applies to that information as well.
              However, this Policy does not apply to what those third party
              social networking platforms and blogging platforms do with your
              information. Those platforms have their own privacy policies,
              which explain how they will use, protect and share your
              information, and we encourage you to read them.
            </p>
            <h4 className={styles.sectionHeader}>Opt In and Opt Out</h4>
            <p>
              You may have the right to opt in to or opt out of certain of our
              uses and disclosures of your Personal Information. For example,
              when you are asked to provide Personal Information on this
              website, you may have the opportunity to elect to, or not to,
              receive messages from us by e-mail. If you would like to stop
              receiving marketing or promotional communications via email from
              Shortage, you may opt out of such communications by clicking on
              the unsubscribe link in any email and updating the “manage
              preferences” form. You can also opt-out of our promotional emails
              by sending us your name, address, e-mail and phone number to:{' '}
              <a href="mailto:support@shortage.global">
                support@shortage.global
              </a>
              . Please understand that it may take us a few days to process any
              opt out request and that even if you opt out of receiving
              promotional correspondence from us, we may still contact you in
              connection with your relationship, activities, transactions and
              communications with us.
            </p>
            <h4 className={styles.sectionHeader}>
              Use of your Personal Information
            </h4>
            <p>
              Shortage collects and uses your Personal Information, including
              User-Provided Information, Automatically Collected Information
              and/or any information collected through Social Networking sites,
              to perform the following business functions:
            </p>
            <ul>
              <li>enabling users to use our website and its features</li>
              <li>processing and fulfilling your transactions</li>
              <li>administering the website and your account with us</li>
              <li>responding to your requests, questions, and concerns</li>
              <li>market research</li>
              <li>developing new features and offerings on the website</li>
              <li>
                consistent with any communications preferences you have set on
                the Shortage website, sending you marketing and other
                communications, including announcements, promotional offers,
                alerts, confirmations, surveys and/or general communications
                about products, services, and events, of ours and of others,
                that we think might interest you. You may opt out of receiving
                such notices from us by following the instructions in the Opt In
                and Opt Out section above.
              </li>
              <li>protecting our rights and property</li>
              <li>recovering debt and preventing fraud</li>
              <li>
                customizing our Website to your interests and history with us
              </li>
              <li>
                tailoring ads displayed to you on our website and elsewhere to
                your interests and history with us
              </li>
              <li>
                in connection with organizational changes or dissolution,
                including for example a merger, acquisition, reorganization,
                consolidation, bankruptcy, liquidation, sale of assets or wind
                down of operations
              </li>
              <li>
                other purposes disclosed when Personal Information is submitted
                to us
              </li>
            </ul>
            <p>
              To perform the above functions, we may match information collected
              from you through different means or at different times, including
              both Personal Information and Automatically Collected Information,
              and use such information along with information obtained from
              other sources (including third parties) such as demographic
              information and updated contact information. We or our service
              providers may also use your information to assess the level of
              interest in, and use of, the Shortage website, our e-mails and our
              other messaging campaigns both on an individual basis and in the
              aggregate.
            </p>
            <h4 className={styles.sectionHeader}>
              Sharing Information with Third Parties
            </h4>
            <p>
              Shortage does not sell, rent or lease its customer or donor
              information to third parties, nor do we share, trade or exchange
              that information in any way. However, information you voluntarily
              post to public areas on the Shortage web site will be available to
              other Shortage website users.
            </p>
            <p>
              As described in <b>Use of your Personal Information</b>, Shortage
              may, from time to time, contact you on behalf of external business
              partners about a particular offering that may be of interest to
              you. In those cases, your unique personally identifiable
              information (email, name, address, telephone number) is not
              transferred to the third party.
            </p>
            <p>
              Shortage may share your information with our co-sponsor(s) if we
              obtain your information in connection with a contest, sweepstakes,
              offering, or other promotional activity that is jointly offered by
              us and any third parties, unless you instruct us not to by
              following the instructions in the Opt In and Opt Out section
              above.
            </p>
            <p>
              Shortage may share data with trusted partners to help perform
              credit card processing, statistical analysis, marketing, provide
              customer support, data storage, data analysis and processing,
              legal services, send you email or postal mail, or arrange for
              deliveries. For example, we may store your data on external data
              storage sites or servers provided by third party hosting vendors
              with whom we have contracted. All such third parties are
              prohibited from using your Personal Information except to provide
              these services to Shortage, and they are required to maintain the
              confidentiality of your information.
            </p>
            <p>
              We utilize Google Analytics for our web analytics and you can opt
              out of your website usage data being included in our Google
              Analytics reports by visiting{' '}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noreferrer"
              >
                https://tools.google.com/dlpage/gaoptout
              </a>
              .
            </p>
            <p>
              Shortage may disclose your Personal Information, without
              additional notice, if required to do so by law or in the good
              faith belief that such action is necessary to: (a) conform to the
              edicts of the law or comply with legal process served on Shortage
              or the website; (b) protect and defend the rights or property of
              Shortage; and/or (c) act under exigent circumstances to protect
              the personal safety of users of Shortage or the public.
            </p>
            <h4 className={styles.sectionHeader}>Do Not Track Disclosures</h4>
            <p>
              Some web browsers may transmit “do-not-track” (DNT) signals to the
              websites with which the user communicates. Because of differences
              in how web browsers incorporate and activate this feature, it is
              not always clear whether users intend for these signals to be
              transmitted, or whether they even are aware of them. We currently
              do not change our tracking practices (which are explained in more
              detail under “Automatically Collected Information” above) in
              response to DNT settings in your web browser.
            </p>
            <h4 className={styles.sectionHeader}>
              Security of your Personal Information
            </h4>
            <p>
              Shortage endeavors to secure your Personal Information from
              unauthorized access, use or disclosure. Unfortunately, due to the
              inherent nature of the Internet as an open global communications
              vehicle, no data transmission over the Internet or any wireless
              network can be guaranteed to be 100% secure. We cannot guarantee
              that any information, during transmission through the Internet or
              while stored on our system or otherwise in our care, will be
              absolutely safe from intrusion by others, such as hackers.
            </p>
            <p>
              As a result, while we strive to protect your information, you
              acknowledge that: (a) there are security and privacy limitations
              inherent to the Internet which are beyond our control; and (b)
              security, integrity, and privacy of any and all information and
              data exchanged between you and us through this website cannot be
              guaranteed. While no website or electronic data can ever be
              completely secure, we are always working to maintain up-to-date
              and appropriate security mechanisms.
            </p>
            <p>
              We use a variety of security measures to protect your personal
              information and our data. We maintain procedural, electronic, and
              physical safeguards to help prevent unauthorized access to and
              improper use of personally identifiable information.
            </p>
            <p>
              We protect the security of credit card transactions using measures
              such as encryption, access controls, network firewalls, and
              physical security. These measures make it extremely difficult for
              anyone to intercept any credit card information you send to us.
              When we work with other companies to process credit card
              transactions, those companies also use encryption and other
              appropriate security measures.
            </p>
            <p>
              We will have no liability for disclosure of your information due
              to errors or unauthorized acts of third parties during or after
              transmission.
            </p>
            <p>
              If you create an account on our website, you are responsible for
              maintaining the strict confidentiality of your account password,
              and you shall be responsible for any activity that occurs using
              your account credentials, whether or not you authorized such
              activity. Please notify us of any unauthorized use of your
              password or account or any other breach of security.
            </p>
            <p>
              If at any time during or after our relationship we believe that
              the security of your Personal Information in our care may have
              been compromised, we may seek to notify you of that development.
              If a notification is appropriate, we will endeavor to notify you
              as promptly as possible under the circumstances. If we have your
              e-mail address, we may notify you by e-mail to the most recent
              e-mail address you have provided us in your account profile.
              Please keep your e-mail address in your account up to date. You
              can change that e-mail address at any time in your account
              profile. If you receive a notice from us, you can print it to
              retain a copy of it. To receive these notices, you must check your
              e-mail account using your computer or mobile device and email
              application software.{' '}
              <b>
                You consent to our use of e-mail as a means of such
                notification. If you prefer for us to use the U.S. Postal
                Service to notify you in this situation, please e-mail us at{' '}
                <a href="mailto:support@shortage.global">
                  support@shortage.global
                </a>
              </b>
              . You can make this election any time, and it will apply to
              notifications we make after a reasonable time thereafter for us to
              process your request. You may also use this e-mail address to
              request a print copy, at no charge, of an electronic notice we
              have sent to you regarding a compromise of your Personal
              Information.
            </p>
            <h4 className={styles.sectionHeader}>
              Links and Linked-To Websites
            </h4>
            <p>
              The Shortage website contains links, banners, widgets or
              advertisements that lead to other websites. Please be aware that
              we are not responsible for the content or privacy practices of
              such other websites and so their posted privacy policies (not this
              Policy) will govern the collection and use of your information on
              them. We encourage our users to be aware when they leave our
              website and to read the privacy statements of each website visited
              after leaving Shoratge to learn about how your information is
              treated by others.
            </p>
            <h4 className={styles.sectionHeader}>Children Under Thirteen</h4>
            <p>
              Shortage does not knowingly collect personally identifiable
              information from children under the age of thirteen, and the
              website is not intended for users who are under 13 years old.
            </p>
            <h4 className={styles.sectionHeader}>
              Changes to this Privacy Policy
            </h4>
            <p>
              Shortage reserves the right to change this Privacy Policy from
              time to time. We will notify you about significant changes in the
              way we treat Personal Information by sending a notice to the
              primary email address specified in your account, by placing a
              prominent notice on our website, and/or by updating any privacy
              information on this page. For some changes to our Privacy Policy,
              we may ask for your consent.
            </p>
            <h4 className={styles.sectionHeader}>Contact Information</h4>
            <p>
              Shortage welcomes your questions or comments regarding this
              Privacy Policy. If you believe that Shortage has not adhered to
              this Privacy Policy, please contact Shortage at:
            </p>

            <p>Shortage</p>
            <p>440 N Barranca Ave #7074</p>
            <p>Covina, CA 91723</p>
            <p>
              Email:{' '}
              <a href="mailto:support@shortage.global">
                support@shortage.global
              </a>
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PrivacyPolicy;
