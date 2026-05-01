import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  downloadCourseCertificate,
  fetchCourseLearningDetail,
  submitAssignment,
  updateLessonProgress,
  type CourseLearningDetail,
  type CourseLearningLesson
} from '../services/courses'

function CourseLearn() {
  const { id } = useParams<{ id: string }>()
  const [detail, setDetail] = useState<CourseLearningDetail | null>(null)
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null)
  const [assignmentAnswers, setAssignmentAnswers] = useState<Record<string, number>>({})
  const [assignmentFeedback, setAssignmentFeedback] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [downloadingCertificate, setDownloadingCertificate] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const formatLabel = (value?: string | null) => {
    if (!value) return ''
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
  }

  useEffect(() => {
    if (!id) return
    let cancelled = false

    ;(async () => {
      setLoading(true)
      setErrorMessage('')
      try {
        const result = await fetchCourseLearningDetail(Number(id))
        if (!cancelled) {
          setDetail(result)
          const firstLesson = result.modules.flatMap((module) => module.lessons)[0]
          setSelectedLessonId(firstLesson?.id ?? null)
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to load course learning detail', error)
          setDetail(null)
          setErrorMessage('You can only access purchased courses. Please purchase this course first.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [id])

  const selectedLesson = useMemo(() => {
    if (!detail || selectedLessonId === null) return null
    for (const module of detail.modules) {
      const lesson = module.lessons.find((item) => item.id === selectedLessonId)
      if (lesson) return lesson
    }
    return null
  }, [detail, selectedLessonId])

  const handleToggleCompletion = async (lesson: CourseLearningLesson, checked: boolean) => {
    if (!detail) return
    setBusy(true)
    try {
      const updated = await updateLessonProgress(detail.course.id, lesson.id, checked)
      setDetail(updated)
      setAssignmentFeedback('')
    } catch (error) {
      console.error('Failed to update lesson progress', error)
    } finally {
      setBusy(false)
    }
  }

  const handleSubmitAssignment = async (lesson: CourseLearningLesson) => {
    if (!detail) return
    const answers = lesson.content.assignmentQuestions.map((_, idx) => {
      const key = `${lesson.id}-${idx}`
      return assignmentAnswers[key] ?? -1
    })

    if (answers.some((answer) => answer < 0)) {
      setAssignmentFeedback('Please answer all questions before submitting.')
      return
    }

    setBusy(true)
    try {
      const result = await submitAssignment(detail.course.id, lesson.id, answers)
      setDetail(result.learning)
      setAssignmentFeedback(
        result.passed
          ? `Passed with ${result.score}% (required ${result.passingScore}%).`
          : `Scored ${result.score}%. You need ${result.passingScore}% to pass.`
      )
    } catch (error) {
      console.error('Failed to submit assignment', error)
      setAssignmentFeedback('Failed to submit assignment. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const handleDownloadCertificate = async () => {
    if (!detail) return
    setDownloadingCertificate(true)
    try {
      await downloadCourseCertificate(detail.course.id)
    } catch (error) {
      console.error('Failed to download certificate', error)
      window.alert(error instanceof Error ? error.message : 'Failed to download certificate')
    } finally {
      setDownloadingCertificate(false)
    }
  }

  if (loading) {
    return (
      <main>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your course...</p>
        </div>
      </main>
    )
  }

  if (!detail) {
    return (
      <main>
        <div className="no-results">
          <i className="fas fa-lock"></i>
          <h3>Course access locked</h3>
          <p>{errorMessage || 'This course is only available to purchased users.'}</p>
          <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
        </div>
      </main>
    )
  }

  const isCourseCompleted = detail.progress.percent > 95

  return (
    <main className="course-learn-page">
      <section className="course-learn-shell">
        <aside className="course-learn-sidebar">
          <div className="course-learn-header">
            <h2>{detail.course.title}</h2>
            <p>{detail.progress.completedLessons}/{detail.progress.totalLessons} lessons completed</p>
            <div className="course-progress-track">
              <div className="course-progress-fill" style={{ width: `${detail.progress.percent}%` }} />
            </div>
            <strong>{detail.progress.percent}%</strong>
          </div>

          <div className="course-learn-modules">
            {detail.modules.map((module) => (
              <div key={module.id} className="course-learn-module">
                <h3>{module.title}</h3>
                <div className="course-learn-lesson-list">
                  {module.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      className={`course-learn-lesson ${selectedLessonId === lesson.id ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedLessonId(lesson.id)
                        setAssignmentFeedback('')
                      }}
                    >
                      <span>
                        <i className={`fas ${lesson.isCompleted ? 'fa-circle-check' : 'fa-circle'}`}></i>
                        {lesson.title}
                      </span>
                      <small>{formatLabel(lesson.contentType)}</small>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {isCourseCompleted && (
            <div className="course-certificate-panel">
              <p className="course-certificate-text">
                Congratulations! You have completed this course. Your certificate is ready.
              </p>
              <button className="btn btn-primary btn-small" onClick={handleDownloadCertificate} disabled={downloadingCertificate}>
                {downloadingCertificate ? 'Preparing...' : 'Download Certificate'}
              </button>
            </div>
          )}
        </aside>

        <section className="course-learn-content">
          {!selectedLesson ? (
            <div className="no-results">
              <h3>No lessons available</h3>
            </div>
          ) : (
            <>
              <div className="course-learn-content-header">
                <h1>{selectedLesson.title}</h1>
                <p>{selectedLesson.description || 'No lesson description.'}</p>
              </div>

              {(selectedLesson.contentType || '').toLowerCase() === 'video' && (
                <div className="course-learn-lesson-body">
                  {selectedLesson.content.videoUrl ? (
                    <iframe
                      title={selectedLesson.title}
                      src={selectedLesson.content.videoUrl.replace('watch?v=', 'embed/')}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <p>Video URL is not available for this lesson.</p>
                  )}
                </div>
              )}

              {(selectedLesson.contentType || '').toLowerCase() === 'article' && (
                <div className="course-learn-lesson-body article" dangerouslySetInnerHTML={{
                  __html: selectedLesson.content.articleText || '<p>No article content available.</p>'
                }} />
              )}

              {(selectedLesson.contentType || '').toLowerCase() === 'assignment' && (
                <div className="course-learn-lesson-body assignment">
                  <p>Pass score: {selectedLesson.content.passingScore}%</p>
                  {selectedLesson.content.assignmentQuestions.map((question, idx) => (
                    <div key={`${selectedLesson.id}-${idx}`} className="assignment-question">
                      <h4>{idx + 1}. {question.question}</h4>
                      <div className="assignment-options">
                        {question.options.map((option, optionIndex) => {
                          const key = `${selectedLesson.id}-${idx}`
                          return (
                            <label key={`${key}-${optionIndex}`}>
                              <input
                                type="radio"
                                name={key}
                                checked={assignmentAnswers[key] === optionIndex}
                                onChange={() => {
                                  setAssignmentAnswers((prev) => ({ ...prev, [key]: optionIndex }))
                                }}
                              />
                              <span>{option}</span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                  <button className="btn btn-primary" disabled={busy} onClick={() => handleSubmitAssignment(selectedLesson)}>
                    Submit Assignment
                  </button>
                  {selectedLesson.score !== null && selectedLesson.score !== undefined && (
                    <p className="course-feedback">Latest score: {selectedLesson.score}%</p>
                  )}
                  {assignmentFeedback && (
                    <p className="course-feedback">{assignmentFeedback}</p>
                  )}
                </div>
              )}

              {(selectedLesson.contentType || '').toLowerCase() !== 'assignment' && (
                <label className="course-learn-complete">
                  <input
                    type="checkbox"
                    checked={selectedLesson.isCompleted}
                    onChange={(event) => handleToggleCompletion(selectedLesson, event.target.checked)}
                    disabled={busy}
                  />
                  <span>Mark lesson as completed</span>
                </label>
              )}
            </>
          )}
        </section>
      </section>
    </main>
  )
}

export default CourseLearn
