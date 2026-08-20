"use client";

import Link from "next/link";
import { ArticleLayout } from "@/components/ui/article-layout";

export function MvpDevelopmentCostContent() {
  return (
    <ArticleLayout slug="mvp-development-cost">
      <p>
        A software MVP that real users can sign up for and pay for costs
        somewhere between $15,000 and $60,000. That is our estimate rather than
        a survey figure, and our own posted bands sit inside it: $18k to $35k
        for a SaaS MVP with authentication, billing and a dashboard, $14k to
        $26k for a mobile app built from scratch.
      </p>
      <p>
        The range is the least useful number on this page. If you are holding
        two quotes for the same brief that differ by four times, the gap is
        almost never talent. It is four mechanical variables: the hourly rate,
        how finely the scope was written, who is carrying requirements risk, and
        whether QA, project management and infrastructure were billed or quietly
        absorbed. What follows is how to audit an estimate, not how to compare
        ranges.
      </p>

      <h2>Why every published MVP price range contradicts the next one</h2>
      <p>
        Search this and you will be told, on one page of results, that an MVP
        costs $5,000 to $100,000, $15,000 to $250,000, $8,000 to $35,000, and
        $30,000 to $80,000. All four are defensible. None is useful, because MVP
        is not a unit of measurement.
      </p>
      <p>
        The unit that transfers between projects is hours per surface &mdash;
        one screen, or one endpoint group, that a user or an integration
        touches. A signup flow with email verification and password reset is 24
        to 40 hours regardless of what your product does afterwards. A Stripe
        subscription flow with a webhook handler, a portal link and correct
        handling of failed payments is 30 to 50 hours whether you sell yoga
        classes or freight logistics. Most MVPs are 12 to 25 surfaces.
      </p>
      <p>
        Count your surfaces. Multiply by a rate. Add the four costs that sit
        outside the build. That number is auditable. A range is not.
      </p>

      <h2>What a real MVP quote contains, line by line</h2>
      <p>
        Six line items. If your quote arrived as one number with a timeline
        attached, send it back and ask for these. They get collapsed because
        itemising them invites you to challenge each one, and a vendor who
        cannot defend a 40-hour QA line would rather you never saw it.
      </p>

      <h3>Where the hours actually go</h3>
      <table>
        <thead>
          <tr>
            <th>Line item</th>
            <th>Share of total</th>
            <th>Typical hours</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Discovery</td>
            <td>5&ndash;8%</td>
            <td>20&ndash;40</td>
          </tr>
          <tr>
            <td>Design</td>
            <td>10&ndash;15%</td>
            <td>40&ndash;90</td>
          </tr>
          <tr>
            <td>Build</td>
            <td>55&ndash;65%</td>
            <td>varies</td>
          </tr>
          <tr>
            <td>Integrations</td>
            <td>10&ndash;15%</td>
            <td>30&ndash;90</td>
          </tr>
          <tr>
            <td>QA</td>
            <td>8&ndash;12%</td>
            <td>15&ndash;20% of build</td>
          </tr>
          <tr>
            <td>Deploy and handover</td>
            <td>3&ndash;5%</td>
            <td>16&ndash;30</td>
          </tr>
        </tbody>
      </table>
      <p>
        Three of those get argued away. <strong>Design</strong> is not brand
        identity: it is wireframes for every surface plus the empty, loading,
        error and permission-denied states, which is where design gets
        underquoted by half, because nobody puts those states in the mock they
        showed you. <strong>QA</strong> is a device matrix and a written test
        pass against the scope document. <strong>Deploy and handover</strong> is
        the production environment, monitoring, backups with a tested restore,
        and the repository transfer. Handover is work. It gets billed or it gets
        skipped.
      </p>

      <h3>What eight weeks actually contains</h3>
      <p>
        Week one is discovery: scope closed, cut list ranked, risks named. Weeks
        two and three run design, the data model and environment setup in
        parallel, with a first deploy to staging in week two &mdash; before any
        feature is finished, because deploying late is the most reliable way to
        lose a launch date. Weeks four to six are the build. Week seven hardens
        integrations and spends the QA pass. Week eight is production and
        handover.
      </p>
      <p>
        There is no week in that plan for the thing you forgot. Weeks four to
        six are where forgetting surfaces, and absorbing it is what the
        contingency inside a fixed price is for. If a timeline has no slack in
        it, the slack is coming out of QA.
      </p>

      <h2>The four costs that quietly fall outside the quote</h2>
      <p>
        None of these is fraud. They sit outside the build, which is why they sit
        outside most build quotes, and why founders meet them one at a time
        after signing.
      </p>

      <h3>Third-party running costs</h3>
      <p>
        Not build cost. Monthly cost, from day one, forever. A conventional
        stack runs managed auth (free to roughly 10,000 monthly active users,
        then a couple of cents each), Stripe at 2.9% plus 30 cents a
        transaction, transactional email at $15 to $50, error monitoring from
        about $26, and hosting with a managed Postgres at $20 to $200. Pre-launch
        that is $80 to $400 a month. If the product calls a language model,
        budget tokens per user action, not per month: one retrieval-augmented
        answer costs fractions of a cent, a nightly job that re-processes every
        record does not.
      </p>

      <h3>Environment setup</h3>
      <p>
        Staging and production, CI, secrets management, database migrations,
        seed data, preview deployments. Twenty to forty hours of real engineering
        that appears in no design mock and gets absorbed into the build line
        until the week it cannot be. If you are told it is included, ask which
        number it is included inside.
      </p>

      <h3>App Store and compliance overhead</h3>
      <p>
        Apple Developer is $99 a year and Google Play is $25 once &mdash; the
        trivial part. The real cost is privacy nutrition labels, the Play data
        safety form, screenshots at every required size, review notes, and the
        first rejection. Budget two calendar weeks between the app being
        finished and the app being downloadable, and treat it as latency rather
        than work: you cannot staff your way out of it.
      </p>
      <p>
        And if you sell digital goods in the app, Apple takes 15 to 30 percent of
        every transaction, permanently. That has ended more mobile business
        cases than any development quote, which is why we raise it in the first
        conversation about{" "}
        <Link href="/services/mobile-app-development">
          building a React Native app
        </Link>
        .
      </p>

      <h3>Maintenance after launch</h3>
      <p>
        Budget 15 to 20 percent of build cost per year, starting the month after
        launch. Dependencies ship breaking major versions, iOS and Android drop
        support for what you shipped on, store policies change, and security
        patches are not optional. Our posted retainers are what that band looks
        like in practice: from $4,000 a month for{" "}
        <Link href="/services/web-development">
          continued Next.js development after launch
        </Link>
        , from $2,400 for a mobile app, from $1,800 for an automation pipeline.
        A quote that never mentions month thirteen is a quote that ends at month
        twelve.
      </p>

      <h2>Why the same brief gets quotes four times apart</h2>
      <p>
        Four variables produce almost the entire spread. Rate is only one, and
        rarely the largest.
      </p>

      <h3>Rate: offshore versus US MVP development</h3>
      <table>
        <thead>
          <tr>
            <th>Region</th>
            <th>Agency rate per hour</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>United States, Western Europe</td>
            <td>$120&ndash;$250</td>
          </tr>
          <tr>
            <td>Eastern Europe, Latin America</td>
            <td>$50&ndash;$90</td>
          </tr>
          <tr>
            <td>South and Southeast Asia</td>
            <td>$25&ndash;$60</td>
          </tr>
        </tbody>
      </table>
      <p>
        Those bands are what we see quoted, not a published survey. We are in
        Lahore and quote inside the third one. That is a genuine cost difference
        and we will not pretend otherwise. It is also not a four-times
        explanation on its own: rate gaps compress once you account for hours
        booked, and reverse entirely if the cheaper engagement needs a rewrite.
        What decides whether the discount survives is handover discipline and
        code review, the subject of our piece on{" "}
        <Link href="/insights/working-with-offshore-development-team">
          running an offshore development engagement
        </Link>
        .
      </p>

      <h3>Scope granularity</h3>
      <p>
        One vendor read &ldquo;user login&rdquo; as a single line. The other
        read it as eleven: email and password, OAuth, verification mail,
        password reset, session handling, rate limiting, account lockout, an
        audit trail, admin impersonation, deletion, and the tests. Identical words
        in your brief, double the hours. The second reading is not padding. It
        is what login is, and you pay for it either in the quote or in month
        four.
      </p>

      <h3>Who carries requirements risk</h3>
      <p>
        A fixed price moves risk to the vendor. One who accepts it without a paid
        discovery has either priced it as contingency &mdash; typically 25 to 40
        percent &mdash; or has not priced it and intends to recover it through
        change orders. Time and materials moves the risk back to you and looks
        cheaper on the page, precisely because your contingency is the one
        nobody wrote down.
      </p>

      <h3>What got absorbed</h3>
      <p>
        A quote with no project management line is either a solo developer or is
        hiding 10 to 15 percent. Same for QA, same for infrastructure. Absorbed
        cost is still cost; it relocates to whichever line has room to hide it,
        which is almost always the build line &mdash; the line you were least
        equipped to check.
      </p>
      <blockquote>
        <p>
          A fixed-price quote issued without a discovery phase is either padded
          or about to become a change-order fight. There is no third option.
        </p>
      </blockquote>
      <p>
        Nobody prices 400 hours of work off a two-page brief and a 45-minute
        call. A firm number on that basis means they have either loaded enough
        contingency that you are overpaying by a third, or loaded none and plan
        to recover it later as scope changes. The honest version is a paid
        discovery that produces the estimate, quoted separately, which you are
        free to take elsewhere. That last clause is the test.
      </p>

      <h2>Six questions that audit any quote in twenty minutes</h2>
      <p>
        Send these to every vendor in the same email, and compare the replies
        rather than the numbers.
      </p>
      <ol>
        <li>
          <strong>
            What blended hourly rate and how many hours does this imply?
          </strong>{" "}
          An honest answer is a number. A bad one is that they price on value
          rather than hours &mdash; legitimate for an outcome engagement, a
          deflection for a fixed deliverable.
        </li>
        <li>
          <strong>
            Which of the six line items are in here, and which are not?
          </strong>{" "}
          Anything missing should be missing on purpose, with a stated reason.
        </li>
        <li>
          <strong>What triggers a change order, and at what rate?</strong>{" "}
          There should be a written definition and a figure. &ldquo;We are
          flexible&rdquo; means you find out in week six.
        </li>
        <li>
          <strong>What will this cost to run per month at a thousand users?</strong>{" "}
          A vendor who has never considered your payment fees or your token
          spend has considered only the part of your business they get paid to
          write.
        </li>
        <li>
          <strong>
            Who owns the repository, the cloud accounts and the store accounts
            on day one?
          </strong>{" "}
          You do, from the first commit &mdash; not on transfer at the end.
          Ownership held by a vendor is leverage, whether or not anyone intends
          to use it.
        </li>
        <li>
          <strong>What does month thirteen look like?</strong> If there is no
          answer, the estimate ends at launch and so does the relationship.
        </li>
      </ol>
      <p>
        Two answered well out of six is not a disaster. Zero out of six is, and
        it is the cheapest signal you will ever get.
      </p>

      <h2>How to scope an MVP to fit a budget</h2>
      <p>
        Cut in this order. Each is a real reduction in hours rather than a
        corner cut, and each is reversible later at roughly the price you
        avoided today.
      </p>
      <ul>
        <li>
          <strong>The admin panel.</strong> Sixty to a hundred hours of CRUD screens
          that three people will use. Run Retool or supervised database access
          for six months instead.
        </li>
        <li>
          <strong>Custom authentication.</strong> Clerk, Auth0 or Supabase Auth.
          Thirty to sixty hours saved, and better security than a first-pass
          implementation.
        </li>
        <li>
          <strong>The native app.</strong> If you do not need push
          notifications, the camera, offline data or Bluetooth, ship a
          responsive web app first. Our{" "}
          <Link href="/services/web-development">
            Next.js web development work
          </Link>{" "}
          and our mobile work start from that question, and the answer is web
          more often than founders expect.
        </li>
        <li>
          <strong>A bespoke design system.</strong> A token file and an
          off-the-shelf component library produce a coherent product. Bespoke
          components are sixty-plus hours spent before a single user has seen
          anything.
        </li>
        <li>
          <strong>More than two roles.</strong> Ship user and admin. Every extra
          role multiplies the permission tests, and permissions are where a
          missed test is a breach rather than a bug.
        </li>
        <li>
          <strong>Real-time anything.</strong> Poll every ten seconds. Nobody
          will notice, and websockets bring reconnection logic, state
          reconciliation and a scaling problem you have not earned.
        </li>
      </ul>
      <p>
        What not to cut at any budget: authentication correctness, payment
        correctness, the data model, error monitoring, and backups with a
        restore you have actually run. The first three are brutally expensive to
        change later. The last two are how you learn something is broken before
        your users tell you.
      </p>

      <h2>When you should not hire us, or anyone</h2>
      <p>
        If your MVP is a form, a table and an email notification, do not
        commission a build. Airtable with Softr on top, or Glide, will do it for
        $50 to $150 a month and be live this weekend. A $20,000 build for that
        shape of product is not a rip-off; it is a bad trade.
      </p>
      <p>
        If you have not spoken to ten potential users, a build buys you nothing
        that a landing page and ten phone calls does not buy faster and for
        free. The most expensive MVP is the one built correctly and wanted by
        nobody.
      </p>
      <p>
        If you are building a marketplace and have neither side of it, build the
        supply side by hand &mdash; spreadsheets, WhatsApp, manual matching
        &mdash; until it genuinely hurts. Software automates a process that
        already works badly. It cannot invent one.
      </p>
      <p>
        If you need it in three weeks and it is nine weeks of work, do not
        compress. Cut. Compression does not remove hours; it relocates them into
        the bug budget at a worse exchange rate. And if the real question is
        whether to use a studio at all rather than a contractor or a first
        engineering hire, that is a different decision, worked through in{" "}
        <Link href="/insights/in-house-vs-agency-vs-freelancer">
          the in-house, agency and freelancer comparison
        </Link>
        .
      </p>
      <p>
        The limitation of how we work, since this section is meant to cost us
        something: we quote fixed scope only after a paid discovery week, so our
        first deliverable is a document rather than code. A studio willing to
        start on Monday will feel faster for about three weeks. If you already
        have a validated spec we will shorten and reprice discovery, but we will
        not skip it &mdash; and if that is a dealbreaker we are the wrong
        studio.
      </p>

      <h2>The shape of estimate we issue</h2>
      <p>
        Discovery runs one week. It produces a surface inventory with hours
        attached to each surface, a data model sketch, an integration list with
        the monthly running cost of every service on it, a ranked cut list, and a
        risk register. It is quoted separately from the build and it is yours
        &mdash; take it to three other vendors and get like-for-like bids. That
        is what it is for.
      </p>
      <p>
        After that: fixed scope, fixed price, 40 percent at kickoff and the
        balance at handover. Change orders are written, priced and declinable.
        You own the repository and the cloud accounts from the first commit.
      </p>
      <p>
        One thing we will not do is claim this is distilled from a dataset of
        fifty past projects. We have{" "}
        <Link href="/work">three published case studies</Link>{" "}
        and we are not going to invent the rest of a portfolio to sell an
        article. The
        credibility of everything above is method rather than sample size: it is
        how estimates get constructed, and you can check it against any honest
        vendor&rsquo;s process, including one that is not ours.
      </p>
    </ArticleLayout>
  );
}
